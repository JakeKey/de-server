const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	
	let user = await User.findOne({ username: req.body.username });
	if (!user) return res.status(400).send('Invalid username or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid username or password.');

  const token = user.generateAuthToken();
	res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(1024).required()
  });

  return schema.validate(user);
}

module.exports = router;