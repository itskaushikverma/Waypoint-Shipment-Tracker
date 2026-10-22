import express from 'express';
import {
  getShipments,
  getShipment,
  createShipment,
  getETA,
  updateShipmentLocation,
} from '../controllers/shipmentController.js';

const router = express.Router();

router.get('/', getShipments);
router.get('/:id', getShipment);
router.post('/', createShipment);
router.post('/:id/updatelocation', updateShipmentLocation);
router.get('/:id/eta', getETA);

export default router;
