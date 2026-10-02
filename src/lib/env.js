const REQUIRED_SERVER_ENV = ["MONGODB_URI", "JWT_SECRET"];

export function validateServerEnv(required = REQUIRED_SERVER_ENV) {
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(
      `Missing required server environment variable(s): ${missing.join(", ")}`,
    );
  }
}

export function validateUploadEnv() {
  validateServerEnv([
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ]);
}
