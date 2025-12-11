const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { pool } = require('../config/database');
const { metaapi } = require('../config/metaapi');

// Connect trading account
router.post('/connect', authenticateToken, async (req, res) => {
  try {
    const { accountNumber, password, server, platform, licenseId } = req.body;

    if (!metaapi) {
      return res.status(503).json({
        success: false,
        message: 'MetaApi service is not available. Please contact support.',
      });
    }

    // Create MetaApi account
    const account = await metaapi.metatraderAccountApi.createAccount({
      name: `Account ${accountNumber}`,
      type: 'cloud',
      login: accountNumber,
      password: password,
      server: server,
      platform: platform || 'mt4',
      magic: 123456,
      application: 'MetaApi',
      region: 'new-york',
    });

    // Deploy account
    await account.deploy();
    await account.waitDeployed();

    // Get connection
    const connection = account.getRPCConnection();
    await connection.connect();
    await connection.waitSynchronized();

    // Get account information
    const accountInfo = await connection.getAccountInformation();

    // Save to database
    const result = await pool.query(
      'INSERT INTO trading_accounts (user_id, license_id, account_number, broker, server, metaapi_account_id, balance, currency, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        req.user.id,
        licenseId,
        accountNumber,
        accountInfo.broker,
        server,
        account.id,
        accountInfo.balance,
        accountInfo.currency,
        'connected',
      ]
    );

    res.json({
      success: true,
      message: 'Trading account connected successfully',
      account: result.rows[0],
      accountInfo: {
        balance: accountInfo.balance,
        equity: accountInfo.equity,
        currency: accountInfo.currency,
        leverage: accountInfo.leverage,
        broker: accountInfo.broker,
      },
    });
  } catch (error) {
    console.error('Trading account connection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to connect trading account',
    });
  }
});

// Get open positions
router.get('/positions/:accountId', authenticateToken, async (req, res) => {
  try {
    const accountId = req.params.accountId;

    if (!metaapi) {
      return res.status(503).json({
        success: false,
        message: 'MetaApi service is not available',
      });
    }

    const accountQuery = await pool.query(
      'SELECT metaapi_account_id FROM trading_accounts WHERE id = $1 AND user_id = $2',
      [accountId, req.user.id]
    );

    if (accountQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    const metaapiAccountId = accountQuery.rows[0].metaapi_account_id;
    const account = await metaapi.metatraderAccountApi.getAccount(metaapiAccountId);
    const connection = account.getRPCConnection();
    await connection.connect();
    await connection.waitSynchronized();

    const positions = await connection.getPositions();

    res.json({
      success: true,
      positions,
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch positions',
    });
  }
});

// Execute trade
router.post('/trade', authenticateToken, async (req, res) => {
  try {
    const { accountId, symbol, volume, stopLoss, takeProfit, type } = req.body;

    if (!metaapi) {
      return res.status(503).json({
        success: false,
        message: 'MetaApi service is not available',
      });
    }

    const accountQuery = await pool.query(
      'SELECT metaapi_account_id FROM trading_accounts WHERE id = $1 AND user_id = $2',
      [accountId, req.user.id]
    );

    if (accountQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    const metaapiAccountId = accountQuery.rows[0].metaapi_account_id;
    const account = await metaapi.metatraderAccountApi.getAccount(metaapiAccountId);
    const connection = account.getRPCConnection();
    await connection.connect();
    await connection.waitSynchronized();

    let result;
    if (type === 'buy') {
      result = await connection.createMarketBuyOrder(
        symbol,
        volume,
        stopLoss,
        takeProfit,
        {
          comment: 'EA Trade',
          clientId: `EA-${Date.now()}`,
        }
      );
    } else {
      result = await connection.createMarketSellOrder(
        symbol,
        volume,
        stopLoss,
        takeProfit,
        {
          comment: 'EA Trade',
          clientId: `EA-${Date.now()}`,
        }
      );
    }

    res.json({
      success: true,
      message: 'Trade executed successfully',
      orderId: result.orderId,
    });
  } catch (error) {
    console.error('Trade execution error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute trade',
    });
  }
});

module.exports = router;
