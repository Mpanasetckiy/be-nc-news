const { fetchUsers, fetchUserByUsername } = require("../models/users.models");

const getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await fetchUserByUsername(username);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserByUsername };
