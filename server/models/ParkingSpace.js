const mongoose = require('mongoose');

const parkingSpaceSchema = new mongoose.Schema({
  garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage', required: true },
  number: { type: Number, required: true },
  status: { type: String, enum: ['REPARK', 'RENTED', 'FREE'], required: true, default: 'FREE' },
  notes: { type: String, trim: true },
  lastStatusChange: { type: Date, default: Date.now },
}, { timestamps: true });

parkingSpaceSchema.index({ garage: 1, number: 1 }, { unique: true });

parkingSpaceSchema.methods.changeStatus = async function(newStatus, effectiveDate, requestedBy) {
  const StatusChange = mongoose.model('StatusChange');
  await StatusChange.create({ space: this._id, currentStatus: this.status, newStatus, effectiveDate, requestedBy });
  const now = new Date();
  if (new Date(effectiveDate) <= now) {
    this.status = newStatus;
    this.lastStatusChange = now;
    await this.save();
  }
  return this;
};

const ParkingSpace = mongoose.model('ParkingSpace', parkingSpaceSchema);
module.exports = ParkingSpace;