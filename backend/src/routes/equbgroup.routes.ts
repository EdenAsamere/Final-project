import express from 'express';
import { 
    createEqubGroup, 
    getAllEqubGroups, 
    getEqubGroupsCreatedByMe,
    getEqubGroupById,
    updateEqubGroup, 
    deleteEqubGroup 
} from '../controllers/equbgroup.controller'
import { authenticate } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/create', authenticate,createEqubGroup);
router.get('/my-equb-groups', authenticate, getEqubGroupsCreatedByMe);
router.get('/all',getAllEqubGroups)
router.get('/:id', getEqubGroupById);
router.put('/update/:id',authenticate, updateEqubGroup);
router.delete('/:id',authenticate, deleteEqubGroup);

export default router;
