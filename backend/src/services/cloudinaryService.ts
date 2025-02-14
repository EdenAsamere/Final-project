import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export const uploadToCloudinary = async (buffer: Buffer): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "live-selfies", resource_type: "image" },
      (error: UploadApiErrorResponse | null | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error?.message || "Unknown error");
          reject(error?.message || "Cloudinary upload failed");
        } else {
          resolve(result?.secure_url || null);
        }
      }
    );

    uploadStream.end(buffer);
  });
};
