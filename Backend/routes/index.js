import express from 'express';

import authRoutes from './authRoutes.js';
import shipmentRouter from './shipmentRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/shipment', shipmentRouter);

export default router;
