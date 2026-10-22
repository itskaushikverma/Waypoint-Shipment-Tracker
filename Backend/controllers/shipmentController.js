import mongoose from 'mongoose';
import Shipment from '../models/Shipment.js';
import calculateETA from '../utils/calculateETA.js';
import {
  validateAccessUser,
  validateContainerId,
  validateLocation,
  validateShipmentStatus,
} from '../utils/validator.js';

export const getShipments = async (req, res) => {
  try {
    const access = await validateAccessUser(req.headers.authorization);
    if (access.message) {
      return res
        .status(access.status)
        .json({ success: false, data: null, message: access.message });
    }

    const shipments = await Shipment.find({ user: access.userId });
    return res.status(200).json({
      success: true,
      data: shipments,
      message: 'Shipments fetched successfully.',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, data: null, message: 'Error fetching shipments' });
  }
};

export const getShipment = async (req, res) => {
  try {
    const access = await validateAccessUser(req.headers.authorization);
    if (access.message) {
      return res
        .status(access.status)
        .json({ success: false, data: null, message: access.message });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, data: null, message: 'Shipment not found' });
    }

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, data: null, message: 'Shipment not found' });
    }

    if (!shipment.user || String(shipment.user) !== access.userId) {
      return res
        .status(403)
        .json({ success: false, data: null, message: 'You do not have access to this shipment' });
    }

    return res.status(200).json({
      success: true,
      data: shipment,
      message: 'Shipment fetched successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, data: null, message: 'Error fetching shipment' });
  }
};

export const createShipment = async (req, res) => {
  try {
    const access = await validateAccessUser(req.headers.authorization);
    if (access.message) {
      return res
        .status(access.status)
        .json({ success: false, data: null, message: access.message });
    }

    const container = validateContainerId(req.body.containerId);
    if (container.message) {
      return res.status(400).json({ success: false, data: null, message: container.message });
    }

    const startLocation = validateLocation(req.body.startLocation, 'Starting location');
    if (startLocation.message) {
      return res.status(400).json({ success: false, data: null, message: startLocation.message });
    }

    const endLocation = validateLocation(req.body.endLocation, 'Ending location');
    if (endLocation.message) {
      return res.status(400).json({ success: false, data: null, message: endLocation.message });
    }

    const statusError = validateShipmentStatus(req.body.status);
    if (statusError) {
      return res.status(400).json({ success: false, data: null, message: statusError.message });
    }

    const arrived = startLocation.lat === endLocation.lat && startLocation.lng === endLocation.lng;
    const shipment = await Shipment.create({
      user: access.userId,
      containerId: container.value,
      currentLocation: startLocation,
      status: req.body.status,
      eta: arrived ? '0' : await calculateETA([endLocation, startLocation], startLocation),
      route: [startLocation, endLocation],
    });

    return res.status(201).json({
      success: true,
      data: shipment,
      message: 'Shipment created successfully.',
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, data: null, message: 'This container ID is already in use' });
    }
    return res.status(500).json({ success: false, data: null, message: 'Internal Server Error' });
  }
};

export const updateShipmentLocation = async (req, res) => {
  try {
    const access = await validateAccessUser(req.headers.authorization);
    if (access.message) {
      return res
        .status(access.status)
        .json({ success: false, data: null, message: access.message });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, data: null, message: 'Shipment not found' });
    }

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, data: null, message: 'Shipment not found' });
    }

    if (!shipment.user || String(shipment.user) !== access.userId) {
      return res
        .status(403)
        .json({ success: false, data: null, message: 'You do not have access to this shipment' });
    }

    const currentLocation = validateLocation(req.body.currentLocation, 'Current location');
    if (currentLocation.message) {
      return res.status(400).json({ success: false, data: null, message: currentLocation.message });
    }

    const destination = validateLocation(shipment.route?.[1], 'Destination');
    if (destination.message) {
      return res
        .status(500)
        .json({ success: false, data: null, message: 'Shipment route is invalid' });
    }

    shipment.currentLocation = currentLocation;
    if (shipment.status === 'Delivered') shipment.status = 'In Transit';

    if (currentLocation.lat === destination.lat && currentLocation.lng === destination.lng) {
      shipment.eta = '0';
    } else {
      shipment.eta = await calculateETA([destination, currentLocation], currentLocation);
    }

    await shipment.save();
    return res.status(200).json({
      success: true,
      data: shipment,
      message: 'Location updated successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, data: null, message: 'Error updating location' });
  }
};

export const getETA = async (req, res) => {
  try {
    const access = await validateAccessUser(req.headers.authorization);
    if (access.message) {
      return res
        .status(access.status)
        .json({ success: false, data: null, message: access.message });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, data: null, message: 'Shipment not found' });
    }

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, data: null, message: 'Shipment not found' });
    }

    if (!shipment.user || String(shipment.user) !== access.userId) {
      return res
        .status(403)
        .json({ success: false, data: null, message: 'You do not have access to this shipment' });
    }

    const currentLocation = validateLocation(shipment.currentLocation, 'Current location');
    const destination = validateLocation(shipment.route?.[1], 'Destination');
    if (currentLocation.message || destination.message) {
      return res
        .status(500)
        .json({ success: false, data: null, message: 'Shipment route is invalid' });
    }

    const eta = await calculateETA([destination, currentLocation], currentLocation);
    return res.status(200).json({
      success: true,
      data: { eta },
      message: 'ETA calculated successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, data: null, message: 'Error calculating ETA' });
  }
};
