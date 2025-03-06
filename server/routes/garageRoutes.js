const express = require('express');
const router = express.Router();
const garageController = require('../controllers/garageController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, garageController.getAllGarages);
router.get('/:id', auth, garageController.getGarageDetails);
router.post('/', auth, authorize(['admin']), garageController.createGarage);

module.exports = router;