import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const paymentController = new PaymentController();

// Check blockchain connection
router.get('/check-blockchain', 
    authenticate,
    (req, res) => paymentController.checkBlockchainConnection(req, res)
);

// Get all contributions for an Equb group
router.get('/contributions/:equbId',
    authenticate,
    async (req, res, next) => {
        try {
            await paymentController.getAllContributions(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Initialize payment
router.post('/initiate', 
    authenticate, 
    async (req, res, next) => {
        try {
            await paymentController.initiatePayment(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Verify payment (Chapa webhook)
router.get('/verify/:txRef', 
    (req, res) => paymentController.verifyPayment(req, res)
);

// Payment success route
router.get('/payment-success', 
    authenticate,
    (req, res) => paymentController.paymentSuccess(req, res)
);

// Verify blockchain log
router.get('/verify-blockchain/:txRef', 
    authenticate,
    (req, res) => paymentController.verifyBlockchainLog(req, res)
);

export default router;