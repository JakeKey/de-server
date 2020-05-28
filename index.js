const express = require("express");
const cors = require("cors");
const debug = require("debug")("de:startup");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
require("express-async-errors");

const auth = require("./routes/auth");
const users = require("./routes/users");
const products = require("./routes/products");
const meals = require("./routes/meals");
const diets = require("./routes/diets");

const error = require("./middleware/error.js");

const app = express();
app.use(helmet());
app.use(cors({ exposedHeaders: ["x-auth-token"] }));

if (!config.get("jwt.privateKey") || !config.get("db.host")) {
  debug("Enviromental variables not defined!");
  process.exit(1);
}

if (app.get("env") === "development") {
  app.use(morgan("dev"));
  debug("Morgan enabled...");
}

mongoose
  .connect(config.get("db.host"), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => debug("Connected..."))
  .catch((err) => debug("Not connected: " + err));

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/meals", meals);
app.use("/api/diets", diets);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`));
