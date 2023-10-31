const express = require("express");
const router = express.Router();
const path = require("path");

//this will only look for the slash with the ^/$
//the user can request index as well and the html is option
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;