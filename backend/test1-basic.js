const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Test 1: Basic server works!' });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test 1 passed: Server running on port ${PORT}`);
});
