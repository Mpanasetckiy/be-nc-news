exports.errorHandling = (err, req, res, next) => {
  console.log(err);
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    res.status(err.status).send({ message: err.message });
  }
};
