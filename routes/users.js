const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const { userRoles } = require("../misc");
const { User, validate } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user)
    return res.status(400).send({
      code: "USERNAME_TAKEN",
      message: "Username already taken.",
    });

  user = new User({ ...req.body });

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
