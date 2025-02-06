import express from 'express';
import {
    deleteCollateralDocument,
    getCollateralDocument,
    getUserProfile,
    updateProfile,
    uploadCollateralDocument,
    verifyCollateralDocument,
} from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getUserProfile);
router.put('/update', authenticate, updateProfile);
router.post('/upload-collateral', authenticate, uploadCollateralDocument);
router.get('/collateral/:id', authenticate, getCollateralDocument);
router.put('/verify-collateral/:id', authenticate, verifyCollateralDocument);
router.delete('/delete-collateral/:id', authenticate, deleteCollateralDocument);

export default router;

