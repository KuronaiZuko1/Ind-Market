const { pool } = require('../config/database');

// Get all EAs
const getAllEAs = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expert_advisors WHERE is_active = true ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      eas: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Get EA by ID
const getEAById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM expert_advisors WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'EA not found',
      });
    }

    res.json({
      success: true,
      ea: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Create new EA (admin only)
const createEA = async (req, res, next) => {
  try {
    const {
      name,
      strategyName,
      description,
      imageUrl,
      version,
      price,
      configSchema,
    } = req.body;

    const result = await pool.query(
      'INSERT INTO expert_advisors (name, strategy_name, description, image_url, version, price, config_schema) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, strategyName, description, imageUrl, version, price, configSchema]
    );

    res.status(201).json({
      success: true,
      message: 'EA created successfully',
      ea: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Update EA (admin only)
const updateEA = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      strategyName,
      description,
      imageUrl,
      version,
      price,
      configSchema,
    } = req.body;

    const result = await pool.query(
      'UPDATE expert_advisors SET name = $1, strategy_name = $2, description = $3, image_url = $4, version = $5, price = $6, config_schema = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [name, strategyName, description, imageUrl, version, price, configSchema, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'EA not found',
      });
    }

    res.json({
      success: true,
      message: 'EA updated successfully',
      ea: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Delete EA (admin only)
const deleteEA = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE expert_advisors SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'EA not found',
      });
    }

    res.json({
      success: true,
      message: 'EA deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEAs,
  getEAById,
  createEA,
  updateEA,
  deleteEA,
};
