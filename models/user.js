const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
    match: /^[a-z0-9]+$/i
  },
  isAdmin: Boolean
}));

function validate(user) {
  const schema = {
    name: Joi.string().alphanum().min(3).max(30).required()
  }

  return Joi.validate(user, schema)
}

module.exports = User;
module.exports = validate;