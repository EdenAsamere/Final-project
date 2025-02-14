import { Request, Response, NextFunction } from "express";
import ImageModel from "../models/Image";
import { uploadToCloudinary } from "../services/cloudinaryService";

/**
 * Upload an image to Cloudinary and store the URL in MongoDB.
 */
export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer);
    if (!imageUrl) {
      res.status(500).json({ error: "Cloudinary upload failed" });
      return;
    }

    // Save image to database
    const newImage = new ImageModel({ imageUrl });
    await newImage.save();

    res.status(201).json({ success: true, message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    next(error); // Pass error to global handler
  }
};

/**
 * Retrieve all uploaded images from MongoDB.
 */
export const getImages = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const images = await ImageModel.find().sort({ createdAt: -1 });

    if (!images.length) {
      res.status(404).json({ message: "No images found" });
      return;
    }

    res.status(200).json({ success: true, images });
  } catch (error) {
    console.error("Fetch Images Error:", error);
    next(error);
  }
};
