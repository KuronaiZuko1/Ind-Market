const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

console.log('Loading middleware...');

app.use(helmet());
console.log('✅ Helmet loaded');

app.use(cors());
console.log('✅ CORS loaded');

app.use(express.json());
console.log('✅ Body parser loaded');

app.use(morgan('dev'));
console.log('✅ Morgan loaded');

app.get('/', (req, res) => {
  res.json({ message: 'Test 2: All middleware works!' });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test 2 passed: Server with middleware running on port ${PORT}`);
});
