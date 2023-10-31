//creating logs

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

//creating a date time variable with a specific format function,
//for the log item we are passing the date time, the uuid creates a specific id for each log item and then the message is that actual message.
const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    //here we are looking if something exists, we look at the global path of this file, go up one level and check if the logs folder is there
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(__dirname, "..", "logs");
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log"); //this is like a text file, this would log every request that comes in 
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = {logEvents, logger}