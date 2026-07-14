"use strict";

// One square source image is reused at different display sizes throughout the UI.

const CARD_IMAGE_ROOT = "./assets/card-images";
const CARD_IMAGE_FOLDERS = Object.freeze({
  mobileSuits: "mobile-suits",
  characters: "characters",
  battleships: "battleships"
});

function normalizedCardImageType(type) {
  return {
    mobileSuit: "mobileSuits",
    ms: "mobileSuits",
    character: "characters",
    battleship: "battleships"
  }[type] ?? type;
}

function cardImageKey(type, item) {
  const normalizedType = normalizedCardImageType(type);
  if (!item?.id) return "";
  if (item.imageId) return String(item.imageId);
  if (normalizedType === "characters") return String(item.characterKey ?? item.id);
  return String(item.id);
}

function cardImageUrl(type, item) {
  const normalizedType = normalizedCardImageType(type);
  const folder = CARD_IMAGE_FOLDERS[normalizedType];
  const key = cardImageKey(normalizedType, item);
  if (!folder || !key) return "";
  return `${CARD_IMAGE_ROOT}/${folder}/${encodeURIComponent(key)}.png`;
}

function cardImageRegistered(type, item) {
  const normalizedType = normalizedCardImageType(type);
  const key = cardImageKey(normalizedType, item);
  return Boolean(key && (state.data.cardImages?.[normalizedType] ?? []).includes(key));
}

function cardImageFactionClass(item) {
  const factions = Array.isArray(item?.factions) ? item.factions : [item?.faction].filter(Boolean);
  if (factions.includes("federation") && factions.includes("zeon")) return "card-image--mixed";
  if (factions.includes("federation")) return "card-image--federation";
  if (factions.includes("zeon")) return "card-image--zeon";
  return "card-image--neutral";
}

function cardImageFallbackText(type, item) {
  const normalizedType = normalizedCardImageType(type);
  if (normalizedType === "battleships") return "艦";
  const name = String(item?.name ?? "?").replace(/[\s・（）()]/g, "");
  return [...name].slice(0, 2).join("") || "?";
}

function renderCardImage(type, item, options = {}) {
  const normalizedType = normalizedCardImageType(type);
  const url = cardImageUrl(normalizedType, item);
  if (!url) return "";
  const size = ["xs", "sm", "md", "lg", "token"].includes(options.size) ? options.size : "sm";
  const label = options.decorative === false ? `${item.name}の画像` : "";
  return `
    <span class="card-image card-image--${size} card-image--${normalizedType} ${cardImageFactionClass(item)}" aria-hidden="${options.decorative === false ? "false" : "true"}">
      <span class="card-image-fallback">${escapeAttr(cardImageFallbackText(normalizedType, item))}</span>
      ${cardImageRegistered(normalizedType, item) ? `<img src="${escapeAttr(url)}" alt="${escapeAttr(label)}" loading="${options.eager ? "eager" : "lazy"}" decoding="async" onerror="this.hidden=true" />` : ""}
    </span>
  `;
}

function renderCardImageGroup(entries, options = {}) {
  const images = (entries ?? [])
    .filter((entry) => entry?.item?.id)
    .map((entry) => renderCardImage(entry.type, entry.item, options))
    .filter(Boolean);
  if (images.length === 0) return "";
  return `<span class="card-image-group">${images.join("")}</span>`;
}
