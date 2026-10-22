import mongoose from 'mongoose';

const ShipmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    containerId: {
      type: String,
      required: true,
      unique: true,
      match: /^\d+$/,
    },
    route: [
      {
        lat: Number,
        lng: Number,
      },
    ],
    currentLocation: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Transit'],
      default: 'Pending',
    },
    eta: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Shipment', ShipmentSchema);
