const express = require('express');
const router = express.Router();
const eaController = require('../controllers/eaController');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', eaController.getAllEAs);
router.get('/:id', eaController.getEAById);

// Admin routes
router.post('/', authenticateToken, isAdmin, eaController.createEA);
router.put('/:id', authenticateToken, isAdmin, eaController.updateEA);
router.delete('/:id', authenticateToken, isAdmin, eaController.deleteEA);

module.exports = router;
