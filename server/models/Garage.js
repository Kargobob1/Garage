const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  totalSpaces: { type: Number, required: true, min: 1 },
  description: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

garageSchema.virtual('spaces', { ref: 'ParkingSpace', localField: '_id', foreignField: 'garage' });
garageSchema.virtual('reparkSpaces').get(function() { return this.spaces ? this.spaces.filter(space => space.status === 'REPARK').length : 0; });
garageSchema.virtual('rentedSpaces').get(function() { return this.spaces ? this.spaces.filter(space => space.status === 'RENTED').length : 0; });
garageSchema.virtual('freeSpaces').get(function() { return this.spaces ? this.spaces.filter(space => space.status === 'FREE').length : 0; });

const Garage = mongoose.model('Garage', garageSchema);
module.exports = Garage;