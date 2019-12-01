const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {

	res.send(diet);
});


module.exports = router;