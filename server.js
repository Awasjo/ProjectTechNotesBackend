const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const {logger} = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require('cookie-parser')
const cors = require('cors');
const corsOptions = require('./config/corsOptions');


app.use(logger)

//allow our app to recieve and parse the json data, this is also built in middleware
app.use(express.json())

app.use(cookieParser()) //ability to parse cookies
app.use(cors(corsOptions)) //ability to use options requests, and allows anyone in public can have access to this 


//telling express where to find the static files below, this below is a built in middleware
app.use("/", express.static(path.join(__dirname, "public")));
//
app.use("/", require("./routes/root"));

//for all requests that doesn't exist
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler)
//listens to the 3500 port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
