import express from 'express';
import {
    deleteCollateralDocument,
    getCollateralDocument,
    getMyCollateralDocuments,
    getUserCollateralDocument,
    getUserProfile,
    rejectCollateralController,
    updateProfile,
    uploadCollateralDocument,
    verifyCollateralDocument,
    updateCollateralDocument,
    getApprovedCollateralDocuments,
    getPendingCollateralDocuments,
    getRejectedCollateralDocuments
} from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';
import upload from "../middlewares/upload";

const router = express.Router();

router.get('/', authenticate, getUserProfile);
router.put('/update', authenticate, updateProfile);
router.post("/upload", authenticate, upload.single("documentUrl"), uploadCollateralDocument);
router.get('/approved', authenticate, getApprovedCollateralDocuments);
router.get('/pending', authenticate, getPendingCollateralDocuments);
router.get('/rejected', authenticate, getRejectedCollateralDocuments);
router.patch("/update-document/:id", authenticate, upload.single("documentUrl"), updateCollateralDocument);
router.post("/approve/:id", authenticate, verifyCollateralDocument);
router.post("/reject/:id", authenticate, rejectCollateralController);
router.get('/collateral/:id', authenticate, getCollateralDocument);
router.get('/users-collaterals/:id', authenticate, getUserCollateralDocument);
router.get('/my-collaterals', authenticate, getMyCollateralDocuments);
router.delete('/delete-collateral/:id', authenticate, deleteCollateralDocument);

export default router;

