import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const ImageModel = mongoose.model("Image", ImageSchema);
export default ImageModel; 
