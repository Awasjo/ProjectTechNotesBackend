const { logEvents } = require("./logger");

//this will replace our default error handler
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.log(err.stack); //a lot of details about an error, and shows exact location

  const status = res.statusCode ? res.statusCode : 500; // server error

  res.status(status);

  res.json({ message: err.message, isError: true}); //since we are using rtx redux, setting isError to true is useful information from the backend to the front end devs
};
module.exports = errorHandler;
