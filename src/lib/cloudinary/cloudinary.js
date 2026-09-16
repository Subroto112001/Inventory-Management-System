import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (
  fileInput,
  folder = "uploads",
) => {
  try {
    if (!fileInput) {
      throw new Error("File input is missing");
    }

    const missingConfig = [
      ["CLOUDINARY_CLOUD_NAME", process.env.CLOUDINARY_CLOUD_NAME],
      ["CLOUDINARY_API_KEY", process.env.CLOUDINARY_API_KEY],
      ["CLOUDINARY_API_SECRET", process.env.CLOUDINARY_API_SECRET],
    ]
      .filter(([, value]) => !value)
      .map(([name]) => name);

    if (missingConfig.length > 0) {
      throw new Error(
        `Missing Cloudinary environment variable(s): ${missingConfig.join(", ")}`,
      );
    }

    let uploadContent = fileInput;

    if (
      typeof fileInput === "object" &&
      typeof fileInput.arrayBuffer === "function"
    ) {
      const arrayBuffer = await fileInput.arrayBuffer();

      const buffer = Buffer.from(arrayBuffer);

      uploadContent = `data:${fileInput.type};base64,${buffer.toString(
        "base64",
      )}`;
    }

    const image = await cloudinary.uploader.upload(uploadContent, {
      folder,
      resource_type: "image",
      quality: "auto",
    });

    return {
      publicId: image.public_id,
      url: image.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    const message = error?.error?.message || error.message;
    const uploadError = new Error(`Cloudinary file upload failed: ${message}`);

    uploadError.statusCode = error.http_code;

    throw uploadError;
  }
};

export const deleteCloudinaryFile = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return response;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);

    throw new Error(`Cloudinary file deletion failed: ${error.message}`);
  }
};
