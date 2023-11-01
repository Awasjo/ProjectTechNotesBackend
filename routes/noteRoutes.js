const express = require("express");
const router = express.Router();
const notesController = require('../controllers/notesController')

//now we are at the users route, below will show the users route
router.route("/")
.get(notesController.getAllNotes)
.post(notesController.createNewNote)
.patch(notesController.updateNote)
.delete(notesController.deleteNote);

module.exports = router;
