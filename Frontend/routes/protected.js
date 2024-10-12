// routes/protected.js
const express = require('express');
const ensureAuthenticated = require('../middleware/auth');

const router = express.Router();

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Welcome to the protected route');
});

module.exports = router;
