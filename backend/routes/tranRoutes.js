import express from 'express';
const router = express.Router();

import { createTran, deleteTran, getAllTran, showStats, updateTran } from '../controllers/tranController.js';

import testUser from '../middleware/testUser.js';

router.route('/').post(testUser, createTran).get(getAllTran);
// remember about :id
router.route('/stats').get(showStats);
router.route('/:id').delete(testUser, deleteTran).patch(testUser, updateTran);

export default router;
