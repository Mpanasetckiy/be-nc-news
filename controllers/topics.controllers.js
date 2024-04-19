const { fetchTopics, insertTopic } = require("../models/topics.models");

const getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

const postTopic = async (req, res, next) => {
  try {
    const newTopic = req.body;
    const topic = await insertTopic(newTopic);
    res.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTopics, postTopic };
