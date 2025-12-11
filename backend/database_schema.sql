-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expert Advisors Table
CREATE TABLE IF NOT EXISTS expert_advisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    strategy_name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    version VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    config_schema JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ea_id UUID REFERENCES expert_advisors(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    expires_at TIMESTAMP,
    activated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_status CHECK (status IN ('active', 'expired', 'revoked', 'pending'))
);

-- Trading Accounts Table
CREATE TABLE IF NOT EXISTS trading_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_id UUID REFERENCES licenses(id) ON DELETE CASCADE,
    account_number VARCHAR(255) NOT NULL,
    broker VARCHAR(255) NOT NULL,
    server VARCHAR(255) NOT NULL,
    metaapi_account_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'connected',
    balance DECIMAL(15, 2),
    currency VARCHAR(10),
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_sync TIMESTAMP,
    CONSTRAINT check_account_status CHECK (status IN ('connected', 'disconnected', 'error'))
);

-- EA Sessions Table
CREATE TABLE IF NOT EXISTS ea_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID REFERENCES licenses(id) ON DELETE CASCADE,
    trading_account_id UUID REFERENCES trading_accounts(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'running',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stopped_at TIMESTAMP,
    config JSONB,
    CONSTRAINT check_session_status CHECK (status IN ('running', 'stopped', 'paused', 'error'))
);

-- EA Trades Table
CREATE TABLE IF NOT EXISTS ea_trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES ea_sessions(id) ON DELETE CASCADE,
    trading_account_id UUID REFERENCES trading_accounts(id) ON DELETE CASCADE,
    trade_id VARCHAR(255),
    symbol VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    volume DECIMAL(10, 2) NOT NULL,
    open_price DECIMAL(15, 5) NOT NULL,
    close_price DECIMAL(15, 5),
    stop_loss DECIMAL(15, 5),
    take_profit DECIMAL(15, 5),
    profit DECIMAL(15, 2),
    commission DECIMAL(10, 2),
    swap DECIMAL(10, 2),
    opened_at TIMESTAMP NOT NULL,
    closed_at TIMESTAMP,
    CONSTRAINT check_trade_type CHECK (type IN ('buy', 'sell'))
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_ea ON licenses(ea_id);
CREATE INDEX IF NOT EXISTS idx_trading_accounts_user ON trading_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_ea_sessions_license ON ea_sessions(license_id);
CREATE INDEX IF NOT EXISTS idx_ea_trades_session ON ea_trades(session_id);

-- Insert Sample Admin User (password: admin123)
INSERT INTO users (email, password_hash, name, role) 
VALUES ('admin@ealicense.com', '$2b$10$rQ9xKGH7YvZ8wKxDxHxVJOXy5vZxPKvQwXQqKGH7YvZ8wKxDxHxVJ', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample EA
INSERT INTO expert_advisors (name, strategy_name, description, version, price, config_schema)
VALUES (
    'Trend Master Pro',
    'Moving Average Crossover',
    'Advanced trend following strategy using moving average crossovers',
    '1.0.0',
    99.00,
    '{"lotSize": 0.01, "stopLoss": 50, "takeProfit": 100, "maxTrades": 3}'::jsonb
)
ON CONFLICT DO NOTHING;
