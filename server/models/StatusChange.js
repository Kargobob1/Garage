const mongoose = require('mongoose');

const statusChangeSchema = new mongoose.Schema({
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpace', required: true },
  currentStatus: { type: String, enum: ['REPARK', 'RENTED', 'FREE'], required: true },
  newStatus: { type: String, enum: ['REPARK', 'RENTED', 'FREE'], required: true },
  effectiveDate: { type: Date, required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'], default: 'PENDING' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedOn: { type: Date },
  notificationSent: { type: Boolean, default: false },
}, { timestamps: true });

statusChangeSchema.methods.approve = async function(approvedBy) {
  this.status = 'APPROVED';
  this.approvedBy = approvedBy;
  this.approvedOn = new Date();
  await this.save();
  return this;
};

statusChangeSchema.methods.reject = async function(rejectedBy) {
  this.status = 'REJECTED';
  this.approvedBy = rejectedBy;
  this.approvedOn = new Date();
  await this.save();
  return this;
};

const StatusChange = mongoose.model('StatusChange', statusChangeSchema);
module.exports = StatusChange;