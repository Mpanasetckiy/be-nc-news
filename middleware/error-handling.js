exports.pgErrorHandling = (err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    console.log(err.code, err.message);
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23503") {
    console.log(err.code, err.message);
    res.status(404).send({ message: "No key found" });
  } else {
    next(err);
  }
};

exports.errorHandling = (err, req, res, next) => {
  console.log(err.status, err.message);
  res.status(err.status).send({ message: err.message });
};
