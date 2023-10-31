const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;

//telling express where to find the static files below
app.use("/", express.static(path.join(__dirname, "public")));
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
//listens to the 3500 port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
