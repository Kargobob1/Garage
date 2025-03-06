const StatusChange = require('../models/StatusChange');
const ParkingSpace = require('../models/ParkingSpace');
const Garage = require('../models/Garage');
const User = require('../models/User');
// const emailService = require('../services/emailService'); // E-Mail-Service auskommentiert

exports.requestChange = async (req, res) => {
  try {
    const { spaceId, newStatus, effectiveDate } = req.body;
    const minDate = new Date();
    minDate.setUTCDate(minDate.getUTCDate() + 21);
    minDate.setUTCHours(0, 0, 0, 0);

    if (new Date(effectiveDate) < minDate) {
      return res.status(400).json({ message: 'Effective date must be at least 3 weeks in the future' });
    }

    const space = await ParkingSpace.findById(spaceId);
    if (!space) return res.status(404).json({ message: 'Parking space not found' });

    if (space.status === newStatus) return res.status(400).json({ message: 'New status must be different from current status' });

    const change = await space.changeStatus(newStatus, effectiveDate, req.user.id);
    const garage = await Garage.findById(space.garage);
    const requestedBy = await User.findById(req.user.id);

    /*
    await emailService.sendStatusChangeNotification({
      to: 'locations@repark.at',
      garageName: garage.name,
      spaceNumber: space.number,
      currentStatus: space.status,
      newStatus,
      effectiveDate,
      requestedBy: requestedBy.username,
    });
    */

    res.status(201).json({ message: 'Status change requested successfully', change });
  } catch (error) {
    console.error('Request change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingChanges = async (req, res) => {
  try {
    const garageId = req.params.garageId;
    const spaces = await ParkingSpace.find({ garage: garageId });

    if (spaces.length === 0) return res.status(404).json({ message: 'Garage not found or has no spaces' });

    const pendingChanges = await StatusChange.find({
      space: { $in: spaces.map(space => space._id) },
      status: 'PENDING',
      effectiveDate: { $gt: new Date() },
    }).populate('space').populate('requestedBy', 'username');

    const formattedChanges = pendingChanges.map(change => ({
      id: change._id,
      spaceNumber: change.space.number,
      currentStatus: change.currentStatus,
      newStatus: change.newStatus,
      effectiveDate: change.effectiveDate,
      requestedBy: change.requestedBy.username,
      requestedOn: change.requestedOn,
    }));

    res.json(formattedChanges);
  } catch (error) {
    console.error('Get pending changes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllPendingChanges = async (req, res) => {
  try {
    const pendingChanges = await StatusChange.find({
      status: 'PENDING',
      effectiveDate: { $gt: new Date() },
    }).populate({ path: 'space', populate: { path: 'garage', select: 'name' } })
        .populate('requestedBy', 'username');

    const formattedChanges = pendingChanges.map(change => ({
      id: change._id,
      garageName: change.space.garage.name,
      garageId: change.space.garage._id,
      spaceNumber: change.space.number,
      currentStatus: change.currentStatus,
      newStatus: change.newStatus,
      effectiveDate: change.effectiveDate,
      requestedBy: change.requestedBy.username,
      requestedOn: change.requestedOn,
    }));

    res.json(formattedChanges);
  } catch (error) {
    console.error('Get all pending changes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveChange = async (req, res) => {
  try {
    const changeId = req.params.id;
    const change = await StatusChange.findById(changeId);

    if (!change) return res.status(404).json({ message: 'Change request not found' });

    if (change.status !== 'PENDING') return res.status(400).json({ message: `Change already ${change.status.toLowerCase()}` });

    await change.approve(req.user.id);
    const space = await ParkingSpace.findById(change.space);
    const garage = await Garage.findById(space.garage);

    /*
    await emailService.sendChangeApprovalNotification({
      to: 'locations@repark.at',
      garageName: garage.name,
      spaceNumber: space.number,
      currentStatus: change.currentStatus,
      newStatus: change.newStatus,
      effectiveDate: change.effectiveDate,
      approvedBy: req.user.username,
    });
    */

    res.json({ message: 'Change approved successfully', change: { id: change._id, status: change.status } });
  } catch (error) {
    console.error('Approve change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectChange = async (req, res) => {
  try {
    const changeId = req.params.id;
    const change = await StatusChange.findById(changeId);

    if (!change) return res.status(404).json({ message: 'Change request not found' });

    if (change.status !== 'PENDING') return res.status(400).json({ message: `Change already ${change.status.toLowerCase()}` });

    await change.reject(req.user.id);
    const space = await ParkingSpace.findById(change.space);
    const garage = await Garage.findById(space.garage);

    /*
    await emailService.sendChangeRejectionNotification({
      to: 'locations@repark.at',
      garageName: garage.name,
      spaceNumber: space.number,
      currentStatus: change.currentStatus,
      newStatus: change.newStatus,
      rejectedBy: req.user.username,
    });
    */

    res.json({ message: 'Change rejected successfully', change: { id: change._id, status: change.status } });
  } catch (error) {
    console.error('Reject change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
