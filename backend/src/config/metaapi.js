const MetaApi = require('metaapi.cloud-sdk').default;
require('dotenv').config();

if (!process.env.METAAPI_TOKEN) {
  console.error('❌ METAAPI_TOKEN is not set in environment variables');
  process.exit(1);
}

const metaapi = new MetaApi(process.env.METAAPI_TOKEN);

console.log('✅ MetaApi SDK initialized');

module.exports = { metaapi };
