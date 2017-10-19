const express = require('express');
const router = express.Router();
const authRoute = require('./authentication');
const blogRoute = require('./blog');


router.use('/authentication', authRoute)
router.use('/blogs', blogRoute)
module.exports = router;
