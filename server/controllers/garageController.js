const Garage = require('../models/Garage');
const ParkingSpace = require('../models/ParkingSpace');
const StatusChange = require('../models/StatusChange');

exports.getAllGarages = async (req, res) => {
  try {
    const garages = await Garage.find().populate('spaces').sort({ name: 1 });
    const garagesWithChanges = await Promise.all(garages.map(async (garage) => {
      const pendingChanges = await StatusChange.countDocuments({
        space: { $in: garage.spaces.map(space => space._id) },
        status: 'PENDING',
        effectiveDate: { $gt: new Date() }
      });
      return {
        id: garage._id,
        name: garage.name,
        address: garage.address,
        totalSpaces: garage.totalSpaces,
        reparkSpaces: garage.reparkSpaces,
        rentedSpaces: garage.rentedSpaces,
        freeSpaces: garage.freeSpaces,
        pendingChanges,
      };
    }));
    res.json(garagesWithChanges);
  } catch (error) {
    console.error('Get all garages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGarageDetails = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id).populate('spaces');
    if (!garage) return res.status(404).json({ message: 'Garage not found' });
    const response = {
      id: garage._id,
      name: garage.name,
      address: garage.address,
      totalSpaces: garage.totalSpaces,
      reparkSpaces: garage.reparkSpaces,
      rentedSpaces: garage.rentedSpaces,
      freeSpaces: garage.freeSpaces,
      spaces: garage.spaces.map(space => ({
        id: space._id,
        number: space.number,          // Hier wird die Nummer übergeben
        status: space.status,
        lastStatusChange: space.lastStatusChange,
      })).sort((a, b) => a.number - b.number),
    };
    res.json(response);
  } catch (error) {
    console.error('Get garage details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createGarage = async (req, res) => {
  try {
    const { name, address, totalSpaces, initialSpaces } = req.body;
    if (!name || !address || !totalSpaces || totalSpaces < 1) {
      return res.status(400).json({ message: 'Invalid garage data' });
    }
    const garage = await Garage.create({
      name,
      address,
      totalSpaces,
      createdBy: req.user.id,
    });
    const spacesData = initialSpaces || Array.from({ length: totalSpaces }, (_, i) => ({
      number: i + 1,
      status: 'FREE',
    }));
    const spaces = await Promise.all(
      spacesData.map(space => ParkingSpace.create({
        garage: garage._id,
        number: space.number,
        status: space.status,
      }))
    );
    res.status(201).json({
      message: 'Garage created successfully',
      garage: { 
        id: garage._id, 
        name: garage.name, 
        address: garage.address, 
        totalSpaces: garage.totalSpaces, 
        spaces: spaces.length 
      },
    });
  } catch (error) {
    console.error('Create garage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
