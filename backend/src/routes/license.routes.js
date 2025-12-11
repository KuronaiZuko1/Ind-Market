const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const {
  validateLicenseCreation,
  validate,
} = require('../middleware/validation.middleware');

// Public route (for mobile app)
router.post('/verify', licenseController.verifyLicense);

// Protected routes
router.get('/my-licenses', authenticateToken, licenseController.getUserLicenses);
router.post('/purchase', authenticateToken, licenseController.purchaseLicense);

// Admin routes
router.post(
  '/create',
  authenticateToken,
  isAdmin,
  validateLicenseCreation,
  validate,
  licenseController.createLicense
);

router.post(
  '/revoke/:licenseId',
  authenticateToken,
  isAdmin,
  licenseController.revokeLicense
);

module.exports = router;
