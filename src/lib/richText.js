import sanitizeHtml from "sanitize-html";

const richTextOptions = {
  allowedTags: [
    "p", "br", "hr", "h1", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s",
    "ul", "ol", "li", "blockquote", "a", "span", "table", "thead", "tbody", "tfoot",
    "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    p: ["style"], h1: ["style"], h2: ["style"], h3: ["style"], h4: ["style"],
    span: ["style"], td: ["style", "colspan", "rowspan"], th: ["style", "colspan", "rowspan"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|center|right|justify)$/],
      color: [/^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]{3,20})$/i],
      "font-size": [/^\d+(?:\.\d+)?(?:px|em|rem|%)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }, true),
  },
};

export function sanitizeRichText(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  const hasMarkup = /<\/?[a-z][^>]*>/i.test(value);
  const source = hasMarkup
    ? value
    : value.split(/\r?\n/).map((line) => line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("<br>");
  return sanitizeHtml(source, richTextOptions).trim();
}

export function sanitizeSpecifications(value) {
  return typeof value === "string" ? sanitizeRichText(value) : value;
}

export function parseProductSpecifications(input) {
  if (Array.isArray(input)) return validateLegacySpecifications(input);
  if (typeof input !== "string" || !input.trim()) return { value: "", errors: [] };

  const source = input.trim();
  if (source.startsWith("[") || source.startsWith("{")) {
    try {
      const parsed = JSON.parse(source);
      if (Array.isArray(parsed)) return validateLegacySpecifications(parsed);
      return { errors: [{ field: "specifications", message: "Legacy specifications must be a JSON array." }] };
    } catch {
      return { errors: [{ field: "specifications", message: "Enter valid rich text or a valid legacy specifications array." }] };
    }
  }

  const value = sanitizeRichText(input);
  if (value.length > 20000) {
    return { errors: [{ field: "specifications", message: "Specifications cannot exceed 20000 characters." }] };
  }
  return { value, errors: [] };
}

function validateLegacySpecifications(specifications) {
  const errors = [];
  if (specifications.length > 50) {
    errors.push({ field: "specifications", message: "You can add no more than 50 legacy specification rows." });
  }
  specifications.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push({ field: `specifications.${index}`, message: "Each specification must have a name and value." });
      return;
    }
    if (typeof item.name !== "string" || !item.name.trim()) {
      errors.push({ field: `specifications.${index}.name`, message: "Specification name is required." });
    } else if (item.name.trim().length > 80) {
      errors.push({ field: `specifications.${index}.name`, message: "Specification name cannot exceed 80 characters." });
    }
    if (typeof item.value !== "string" || !item.value.trim()) {
      errors.push({ field: `specifications.${index}.value`, message: "Specification value is required." });
    } else if (item.value.trim().length > 500) {
      errors.push({ field: `specifications.${index}.value`, message: "Specification value cannot exceed 500 characters." });
    }
  });
  return errors.length
    ? { errors }
    : { value: specifications.map(({ name, value }) => ({ name: name.trim(), value: value.trim() })), errors };
}
