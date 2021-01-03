const express = require('express');
const user = require('./user/userRoute.js');
const router = express.Router();
router.use('/', user);
module.exports = router;
