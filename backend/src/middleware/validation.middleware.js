const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const validateLicenseCreation = [
  body('userEmail')
    .trim()
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('userName')
    .trim()
    .notEmpty()
    .withMessage('User name is required'),
  body('eaId')
    .notEmpty()
    .withMessage('EA ID is required'),
  body('expiresInDays')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Expires in days must be a positive integer'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateLicenseCreation,
  validate,
};
