const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const User = mongoose.model('Users', new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
    unique: true,
    match: /^[a-z0-9]+$/i
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  /*isAdmin: {
    type: Boolean,
    default: false
  }*/
}));

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(1024).required()
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;