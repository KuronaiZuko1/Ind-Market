const crypto = require('crypto');

const generateLicenseKey = () => {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    const segment = crypto.randomBytes(2).toString('hex').toUpperCase();
    segments.push(segment);
  }
  return segments.join('-');
};

module.exports = { generateLicenseKey };
