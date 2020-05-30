const bcrypt = require("bcrypt");
const express = require("express");
const debug = require("debug")("de:users");
const config = require("config");
const axios = require("axios");

const { userRoles } = require("../misc");
const { User, validate } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const secretKey = config.get("google.recaptchaSecret");
  const verificationUrl =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    secretKey +
    "&response=" +
    req.body.reCaptchaToken +
    "&remoteip=" +
    req.connection.remoteAddress;

  const captchaValidationResult = await axios.get(verificationUrl);

  debug("captchaValidationResult", captchaValidationResult);

  if (
    !captchaValidationResult ||
    !captchaValidationResult.data ||
    !captchaValidationResult.data.success
  )
    return res.status(400).send({ code: "INVALID_CAPTCHA" });

  let user = await User.findOne({ username: req.body.username });
  if (user)
    return res.status(400).send({
      code: "USERNAME_TAKEN",
      message: "Username already taken.",
    });

  user = new User({ username: req.body.username, password: req.body.password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.role = userRoles.user;

  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send({ id: user._id, username: user.username });
});

module.exports = router;
