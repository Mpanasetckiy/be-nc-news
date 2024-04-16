const { fetchUsers } = require("../models/users.models");

const getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };
