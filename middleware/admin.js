const { userRoles } = require("../misc");

module.exports = function (req, res, next) {
  if (req.user.role !== userRoles.admin)
    return res.status(403).send("Access denied.");

  next();
};
