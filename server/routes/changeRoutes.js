const express = require('express');
const router = express.Router();
const changeController = require('../controllers/changeController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', auth, changeController.requestChange);
router.get('/pending/:garageId', auth, changeController.getPendingChanges);
router.get('/pending', auth, changeController.getAllPendingChanges);
router.put('/:id/approve', auth, authorize(['manager', 'admin']), changeController.approveChange);
router.put('/:id/reject', auth, authorize(['manager', 'admin']), changeController.rejectChange);

module.exports = router;