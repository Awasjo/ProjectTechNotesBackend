const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler"); //keep us from using try catch blocks

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  // Get all notes from MongoDB
  const notes = await Note.find().lean()

  // If no notes 
  if (!notes?.length) {
      return res.status(400).json({ message: 'No notes found' })
  }

  // Add username to each note before sending the response 
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec()
      return { ...note, username: user.username }
  }))

  res.json(notesWithUser)
})

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  // Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  // Create and store the new user
  const noteObject = { user, title, text };
  //   console.log(noteObject)
  const note = await Note.create(noteObject);
  //   console.log("passed create data")

  if (note) {
    // Created
    return res.status(201).json({ message: "New note created" });
  } else {
    return res.status(400).json({ message: "Invalid note data received" });
  }
});
// @desc update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  //confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All field are required" });
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "note not found" });
  }

  //check for duplicates
  const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  //update the note fields
  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();
  res.json({
    message: `Note with the title ${updateNote.title} has updated successfully`,
  });
});
// @desc delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  //confirm the data
  if (!id) {
    return res.status(400).json({ message: "The note ID is required" });
  }

  //is the note completed?
  const note = await Note.findOne(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }
  if (!note.completed) {
    res.status(409).json({ message: "Note is not set to completed" });
  }

  //store the note information
  const deletedNote = {
    title: note.title,
    _id: note.id,
  };

  await note.deleteOne();

  const reply = `Note: ${deletedNote.title} with ID ${deletedNote._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
