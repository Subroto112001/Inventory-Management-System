import { uploadImageToCloudinary, deleteCloudinaryFile } from "@/lib/cloudinary/cloudinary";

export async function readProductRequest(request) {
  if (!(request.headers.get("content-type") || "").includes("multipart/form-data")) {
    return { body: await request.json(), files: [], manifest: null };
  }
  const form = await request.formData();
  try {
    return {
      body: JSON.parse(form.get("payload") || "{}"),
      manifest: form.has("imageManifest") ? JSON.parse(form.get("imageManifest")) : null,
      files: form.getAll("images").filter((file) => file && typeof file !== "string" && file.size > 0),
    };
  } catch {
    throw Object.assign(new Error("Invalid product or image data."), { statusCode: 400 });
  }
}

export function validateImageFiles(files) {
  if (files.length > 4) throw Object.assign(new Error("A product can have at most four images."), { statusCode: 400 });
  for (const file of files) {
    if (!file.type?.startsWith("image/")) throw Object.assign(new Error("Only image files are allowed."), { statusCode: 400 });
    if (file.size > 5 * 1024 * 1024) throw Object.assign(new Error("Each image must be 5 MB or smaller."), { statusCode: 400 });
  }
}

export async function resolveImages({ manifest, files, previousImages = [], legacyImages = [], mainImageIndex }) {
  if (manifest === null) {
    if (files.length) throw Object.assign(new Error("Image selection is invalid."), { statusCode: 400 });
    return legacyImages;
  }
  if (!Array.isArray(manifest) || manifest.length > 4 || manifest.length !== files.length + manifest.filter((entry) => entry?.type === "existing").length) {
    throw Object.assign(new Error("A product can have at most four valid images."), { statusCode: 400 });
  }
  validateImageFiles(files);
  const seen = new Set();
  const seenFileIndexes = new Set();
  for (const entry of manifest) {
    if (entry?.type === "existing") {
      const exists = previousImages.some((image) => image.url === entry.url && (image.public_id || "") === (entry.public_id || ""));
      if (!exists) throw Object.assign(new Error("An existing image selection is invalid."), { statusCode: 400 });
      const key = entry.public_id || entry.url;
      if (seen.has(key)) throw Object.assign(new Error("Duplicate images are not allowed."), { statusCode: 400 });
      seen.add(key);
    } else if (entry?.type !== "new" || !Number.isInteger(entry.fileIndex) || entry.fileIndex < 0 || entry.fileIndex >= files.length || seenFileIndexes.has(entry.fileIndex)) {
      throw Object.assign(new Error("An image selection is invalid."), { statusCode: 400 });
    } else {
      seenFileIndexes.add(entry.fileIndex);
    }
  }
  if (seenFileIndexes.size !== files.length) {
    throw Object.assign(new Error("Image upload selection is incomplete."), { statusCode: 400 });
  }
  if (manifest.length && Number.isInteger(Number(mainImageIndex)) && (Number(mainImageIndex) < 0 || Number(mainImageIndex) >= manifest.length)) {
    throw Object.assign(new Error("Selected main image is invalid."), { statusCode: 400 });
  }

  const uploaded = [];
  try {
    for (const file of files) uploaded.push(await uploadImageToCloudinary(file, "products"));
  } catch (error) {
    await Promise.all(uploaded.map((image) => deleteCloudinaryFile(image.publicId).catch(() => {})));
    throw error;
  }
  const records = manifest.map((entry) => entry.type === "existing"
    ? previousImages.find((image) => image.url === entry.url && (image.public_id || "") === (entry.public_id || ""))
    : { public_id: uploaded[entry.fileIndex].publicId, url: uploaded[entry.fileIndex].url });
  if (records.length && Number.isInteger(Number(mainImageIndex))) {
    const mainIndex = Number(mainImageIndex);
    records.unshift(records.splice(mainIndex, 1)[0]);
  }
  return records;
}
