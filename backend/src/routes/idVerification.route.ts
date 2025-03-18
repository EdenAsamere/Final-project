import express from 'express';
import {
    uploadIdVerificationDocument,
    uploadSelfie,
    submitIdVerificationDocument,
    approveIdVerificationDocument,
    rejectIdVerificationDocument,
    getrejectedIdVerificationDocuments,
    getApprovedIdVerificationDocuments,
    getPendingIdVerificationDocuments,
    reuploadDocumentafterRejection
} from '../controllers/idVerification.controller'

import { authenticate } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload';
import { getIdverificationStatus } from '../controllers/profile.controller';

const router = express.Router();
router.post('/uploadDocument', authenticate, 
    upload.fields([
        { name: "frontId", maxCount: 1 },
        { name: "backId", maxCount: 1 }
    ]),
    uploadIdVerificationDocument);
router.post('/uploadSelfie', authenticate, upload.single('file'), uploadSelfie);
router.post('/submit', authenticate, submitIdVerificationDocument);
router.post('/approve/:id', authenticate, approveIdVerificationDocument);
router.post('/reject/:id', authenticate, rejectIdVerificationDocument);
router.get('/rejectedDocuments', authenticate, getrejectedIdVerificationDocuments);
router.get('/approvedDocuments', authenticate, getApprovedIdVerificationDocuments);
router.get('/pendingDocuments', authenticate, getPendingIdVerificationDocuments);
router.post('/reuploadDocument', authenticate, 
    upload.fields([
        { name: "frontId", maxCount: 1 },
        { name: "backId", maxCount: 1 }
    ]),
    reuploadDocumentafterRejection);

export default router;