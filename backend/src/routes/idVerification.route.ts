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

const router = express.Router();
router.post('/uploadDocument', authenticate, upload.single('file'), uploadIdVerificationDocument);
router.post('/uploadSelfie', authenticate, upload.single('file'), uploadSelfie);
router.post('/submit/:id', authenticate, submitIdVerificationDocument);
router.post('/approve/:id', authenticate, approveIdVerificationDocument);
router.post('/reject/:id', authenticate, rejectIdVerificationDocument);
router.get('/rejectedDocuments', authenticate, getrejectedIdVerificationDocuments);
router.get('/approvedDocuments', authenticate, getApprovedIdVerificationDocuments);
router.get('/pendingDocuments', authenticate, getPendingIdVerificationDocuments);
router.post('/reuploadDocument', authenticate, upload.single('file'), reuploadDocumentafterRejection);

export default router;