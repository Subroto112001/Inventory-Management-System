const escapeXml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const imageUrlFromProduct = (product) => {
  const images = Array.isArray(product.images) ? product.images : [];
  const urls = images.map((item) => (typeof item === "string" ? item : item?.url)).filter(Boolean);
  if (product.image?.url) urls.unshift(product.image.url);
  return [...new Set(urls)];
};

export const getProductImageUrls = imageUrlFromProduct;

export function buildProductInfographic({ product, sourceImage, summary, annotations }) {
  const imageUrl = new URL(sourceImage);
  if (imageUrl.protocol !== "https:") throw new Error("The infographic image must use HTTPS");

  const safeAnnotations = annotations.slice(0, 8);
  const callouts = safeAnnotations
    .map((annotation, index) => {
      const pointX = 42 + (Number(annotation.x) / 100) * 650;
      const pointY = 140 + (Number(annotation.y) / 100) * 600;
      const cardY = 140 + index * 76;
      const color = annotation.kind === "measurement" ? "#F04427" : "#000000";
      const title = annotation.kind === "measurement"
        ? `${annotation.label}: ${annotation.measurementValue} ${annotation.measurementUnit}`.trim()
        : annotation.label;
      const detail = String(annotation.description || "").slice(0, 90);
      const measurement = annotation.kind === "measurement"
        ? `<line x1="${pointX}" y1="${pointY}" x2="${42 + (Number(annotation.x2) / 100) * 650}" y2="${140 + (Number(annotation.y2) / 100) * 600}" stroke="#F04427" stroke-width="3" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`
        : "";

      return `${measurement}<path d="M ${pointX} ${pointY} C 720 ${pointY}, 700 ${cardY + 29}, 744 ${cardY + 29}" fill="none" stroke="${color}" stroke-opacity=".55" stroke-width="2"/><circle cx="${pointX}" cy="${pointY}" r="7" fill="${color}" stroke="#fff" stroke-width="3"/><g><rect x="744" y="${cardY}" width="410" height="60" rx="14" fill="#fff" stroke="#E3E6EA"/><circle cx="772" cy="${cardY + 30}" r="15" fill="${color}"/><text x="772" y="${cardY + 35}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#fff">${index + 1}</text><text x="798" y="${cardY + 27}" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#111318">${escapeXml(title.slice(0, 42))}</text><text x="798" y="${cardY + 47}" font-family="Arial,sans-serif" font-size="13" fill="#6B7280">${escapeXml(detail.slice(0, 55))}</text></g>`;
    })
    .join("");

  const title = escapeXml(product.productName || "Product details");
  const brand = escapeXml(product.brand?.brandName || product.brandName || product.category?.categoryName || "Product features");
  const summaryLines = String(summary || "").trim().slice(0, 230).match(/.{1,100}(?:\s|$)/g) || [];
  const summaryMarkup = summaryLines.slice(0, 2).map((line, index) =>
    `<tspan x="54" dy="${index === 0 ? 0 : 25}">${escapeXml(line.trim())}</tspan>`,
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 940" role="img" aria-labelledby="title description"><title id="title">${title} product infographic</title><desc id="description">Verified product details for ${title}</desc><defs><linearGradient id="surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F1F3F5"/><stop offset="1" stop-color="#F6F7F8"/></linearGradient><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0 0 8 4 0 8z" fill="#F04427"/></marker></defs><rect width="1200" height="940" rx="28" fill="url(#surface)"/><text x="48" y="55" font-family="Arial,sans-serif" font-size="15" font-weight="700" letter-spacing="3" fill="#F04427">PRODUCT DETAILS</text><text x="48" y="100" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#111318">${title.slice(0, 58)}</text><text x="48" y="127" font-family="Arial,sans-serif" font-size="16" fill="#6B7280">${brand.slice(0, 58)}</text><rect x="38" y="145" width="660" height="610" rx="22" fill="#fff" stroke="#E3E6EA"/><image x="54" y="161" width="628" height="578" preserveAspectRatio="xMidYMid meet" href="${escapeXml(imageUrl.href)}" xlink:href="${escapeXml(imageUrl.href)}"/>${callouts}<text x="48" y="808" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="2" fill="#000000">ABOUT THIS PRODUCT</text><text x="48" y="844" font-family="Arial,sans-serif" font-size="18" fill="#514C43">${summaryMarkup}</text><text x="1150" y="900" text-anchor="end" font-family="Arial,sans-serif" font-size="12" fill="#6B7280">Details confirmed by the store</text></svg>`;
}

export function normalizeAnalysisPayload(payload, product) {
  const sourceImage = typeof payload.sourceImage === "string" ? payload.sourceImage.trim() : "";
  if (!imageUrlFromProduct(product).includes(sourceImage)) {
    return { error: "Choose an image from this product's gallery." };
  }

  const summary = typeof payload.summary === "string" ? payload.summary.trim() : "";
  if (summary.length > 500) return { error: "The summary cannot exceed 500 characters." };
  if (!Array.isArray(payload.annotations) || payload.annotations.length > 8) {
    return { error: "Add no more than eight annotations." };
  }

  const annotations = [];
  for (const [index, item] of payload.annotations.entries()) {
    const label = typeof item?.label === "string" ? item.label.trim() : "";
    const description = typeof item?.description === "string" ? item.description.trim() : "";
    const kind = item?.kind === "measurement" ? "measurement" : item?.kind === "feature" ? "feature" : "";
    const coordinates = [item?.x, item?.y, item?.x2 ?? 70, item?.y2 ?? 50].map(Number);
    if (!label || label.length > 60 || description.length > 180 || !kind) {
      return { error: `Annotation ${index + 1} needs a valid type, label, and description.` };
    }
    if (coordinates.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
      return { error: `Annotation ${index + 1} must stay within the image bounds (0–100%).` };
    }

    const measurementValue = typeof item.measurementValue === "string" ? item.measurementValue.trim() : "";
    const measurementUnit = typeof item.measurementUnit === "string" ? item.measurementUnit.trim() : "";
    if (kind === "measurement" && (!measurementValue || !measurementUnit)) {
      return { error: `Measurement ${index + 1} needs a verified value and unit.` };
    }
    annotations.push({
      label,
      description,
      kind,
      x: coordinates[0],
      y: coordinates[1],
      x2: coordinates[2],
      y2: coordinates[3],
      measurementValue: kind === "measurement" ? measurementValue : "",
      measurementUnit: kind === "measurement" ? measurementUnit : "",
      verified: item.verified === true,
    });
  }

  return { value: { sourceImage, summary, annotations } };
}
