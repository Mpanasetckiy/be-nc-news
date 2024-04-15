const { fetchEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res, next) => {
  try {
    const endpoints = fetchEndpoints();
    res.status(200).send({ endpoints });
  } catch (error) {
    next(error);
  }
};
