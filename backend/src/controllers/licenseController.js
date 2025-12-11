const { pool } = require('../config/database');
const { generateLicenseKey } = require('../utils/generateKey');

// Verify license key (public endpoint for mobile app)
const verifyLicense = async (req, res, next) => {
  try {
    const { licenseKey } = req.body;

    const result = await pool.query(
      `SELECT 
        l.*,
        ea.name as ea_name,
        ea.strategy_name,
        ea.description as ea_description,
        ea.image_url,
        ea.version,
        ea.config_schema,
        u.email as user_email,
        u.name as user_name
      FROM licenses l
      JOIN expert_advisors ea ON l.ea_id = ea.id
      JOIN users u ON l.user_id = u.id
      WHERE l.license_key = $1`,
      [licenseKey]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid license key',
      });
    }

    const license = result.rows[0];

    // Check if license is active
    if (license.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'License is not active',
      });
    }

    // Check if license is expired
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      await pool.query(
        'UPDATE licenses SET status = $1 WHERE id = $2',
        ['expired', license.id]
      );
      return res.status(400).json({
        success: false,
        message: 'License has expired',
      });
    }

    // Update activated_at if first time
    if (!license.activated_at) {
      await pool.query(
        'UPDATE licenses SET activated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [license.id]
      );
    }

    res.json({
      success: true,
      license: {
        id: license.id,
        key: license.license_key,
        status: license.status,
        expiresAt: license.expires_at,
        ea: {
          id: license.ea_id,
          name: license.ea_name,
          strategy: license.strategy_name,
          description: license.ea_description,
          image: license.image_url,
          version: license.version,
          configSchema: license.config_schema,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new license (admin only)
const createLicense = async (req, res, next) => {
  try {
    const { userEmail, userName, eaId, expiresInDays = 365 } = req.body;

    // Check if user exists, if not create one
    let userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [userEmail]
    );

    let userId;
    if (userResult.rows.length === 0) {
      // Create new user
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [userName, userEmail, 'temp_password', 'customer']
      );
      userId = newUser.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    // Generate license key
    const licenseKey = generateLicenseKey();

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));

    // Create license
    const result = await pool.query(
      'INSERT INTO licenses (license_key, user_id, ea_id, expires_at, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [licenseKey, userId, eaId, expiresAt, 'active']
    );

    res.status(201).json({
      success: true,
      message: 'License created successfully',
      license: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Get user's licenses
const getUserLicenses = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        l.*,
        ea.name as ea_name,
        ea.strategy_name,
        ea.image_url,
        ea.version
      FROM licenses l
      JOIN expert_advisors ea ON l.ea_id = ea.id
      WHERE l.user_id = $1
      ORDER BY l.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      licenses: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Revoke license (admin only)
const revokeLicense = async (req, res, next) => {
  try {
    const { licenseId } = req.params;

    const result = await pool.query(
      'UPDATE licenses SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['revoked', licenseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'License not found',
      });
    }

    res.json({
      success: true,
      message: 'License revoked successfully',
      license: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Purchase license
const purchaseLicense = async (req, res, next) => {
  try {
    const { eaId } = req.body;
    const userId = req.user.id;

    // Generate license key
    const licenseKey = generateLicenseKey();

    // Calculate expiry date (1 year)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Create license
    const result = await pool.query(
      'INSERT INTO licenses (license_key, user_id, ea_id, expires_at, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [licenseKey, userId, eaId, expiresAt, 'active']
    );

    res.status(201).json({
      success: true,
      message: 'License purchased successfully',
      license: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyLicense,
  createLicense,
  getUserLicenses,
  revokeLicense,
  purchaseLicense,
};
