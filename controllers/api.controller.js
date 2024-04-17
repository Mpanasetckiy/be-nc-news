const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  try {
    res.status(200).send({ endpoints });
  } catch (error) {
    next(error);
  }
};
