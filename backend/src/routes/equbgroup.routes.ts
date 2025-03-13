import express from 'express';
import { 
    createEqubGroup, 
    getAllEqubGroups, 
    getEqubGroupsCreatedByMe,
    getEqubGroupById,
    updateEqubGroup, 
    deleteEqubGroup, 
    savePaymentInitiation,
    verifyPayment,
    sendJoinRequest,
    approveJoinRequest,
    rejectJoinRequest
} from '../controllers/equbgroup.controller'
import { authenticate } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/create', authenticate,createEqubGroup);
router.post('/send-join-request', authenticate,sendJoinRequest);
router.post('/approve-join-request', authenticate,approveJoinRequest);
router.post('/reject-join-request', authenticate,rejectJoinRequest);
router.post('/save-payment-initiation', authenticate,savePaymentInitiation);
router.post('/verify-payment', authenticate,verifyPayment);
router.get('/my-equb-groups', authenticate, getEqubGroupsCreatedByMe);
router.get('/all',getAllEqubGroups)
router.get('/:id', getEqubGroupById);
router.put('/update/:id',authenticate, updateEqubGroup);
router.delete('/:id',authenticate, deleteEqubGroup);

export default router;
