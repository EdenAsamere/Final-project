import express from 'express';
import {
    deleteCollateralDocument,
    getCollateralDocument,
    getMyCollateralDocuments,
    getUserCollateralDocument,
    getUserProfile,
    rejectCollateral,
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
router.post("/collateral/upload", authenticate, upload.single("file"), uploadCollateralDocument);
router.get('/collateral/approved', authenticate, getApprovedCollateralDocuments);
router.get('/collateral/pending', authenticate, getPendingCollateralDocuments);
router.get('/collateral/rejected', authenticate, getRejectedCollateralDocuments);
router.put("/collateral/update-document/:id", authenticate, upload.single("file"), updateCollateralDocument);
router.post("/collateral/approve/:id", authenticate, verifyCollateralDocument);
router.post("/collateral/reject/:id", authenticate, rejectCollateral);
router.get('/collateral/:id', authenticate, getCollateralDocument);
router.get('/users-collaterals/:id', authenticate, getUserCollateralDocument);
router.get('/my-collaterals', authenticate, getMyCollateralDocuments);
router.delete('/delete-collateral/:id', authenticate, deleteCollateralDocument);

export default router;