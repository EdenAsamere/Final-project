"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const equbgroup_controller_1 = require("../controllers/equbgroup.controller");
const router = express_1.default.Router();
router.post('/create', equbgroup_controller_1.createEqubGroup);
router.get('/all', equbgroup_controller_1.getAllEqubGroups);
router.get('/:id', equbgroup_controller_1.getEqubGroupById);
router.put('/:id', equbgroup_controller_1.updateEqubGroup);
router.delete('/:id', equbgroup_controller_1.deleteEqubGroup);
exports.default = router;
