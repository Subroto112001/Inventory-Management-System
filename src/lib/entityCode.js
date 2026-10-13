const ENTITY_PREFIXES = Object.freeze({
  product: "PRD",
  brand: "BRD",
  category: "CAT",
  subcategory: "SUB",
});

export function codeNameSegments(name) {
  const words = String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word.length <= 4 ? word : word.slice(0, 3));
  return [...new Set(words)].slice(0, 3);
}

export function formatEntityCode(entity, name, sequence = 1) {
  const prefix = ENTITY_PREFIXES[entity];
  if (!prefix) throw new Error(`Unsupported code entity: ${entity}`);
  const segments = codeNameSegments(name);
  if (!segments.length) return "";
  const numeric = String(Math.max(1, Number(sequence) || 1)).padStart(4, "0");
  return `${prefix}-${segments.join("-")}-${numeric}`;
}

export function previewEntityCode(entity, name) {
  return formatEntityCode(entity, name, 1);
}

export const entityCodePrefixes = ENTITY_PREFIXES;
