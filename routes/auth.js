const express = require("express");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(400).send({
      code: "INVALID_LOGIN_DATA",
      message: "Invalid username or password.",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      code: "INVALID_LOGIN_DATA",
      message: "Invalid username or password.",
    });

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send({ id: user._id, username: user.username });
});

function validate(user) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(1024).required(),
  });

  return schema.validate(user);
}

module.exports = router;
