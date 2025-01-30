import express from 'express';
import { 
    createEqubGroup, 
    getAllEqubGroups, 
    getEqubGroupById, 
    updateEqubGroup, 
    deleteEqubGroup 
} from '../controllers/equbgroup.controller';

const router = express.Router();

router.post('/create', createEqubGroup);
router.get('/all', getAllEqubGroups);
router.get('/:id', getEqubGroupById);
router.put('/:id', updateEqubGroup);
router.delete('/:id', deleteEqubGroup);

export default router;
