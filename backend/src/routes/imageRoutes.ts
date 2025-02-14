import express from "express";
import upload from "../middlewares/uploads-image";
import { uploadImage, getImages } from "../controllers/imageController";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/images", getImages);

export default router;
