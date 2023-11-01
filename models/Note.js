const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

//refer to the user stories, 10 11 12
//the time stamps is an option for mongoDB
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//there will be another there another collections called counter which will have all this info 
noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq:500,
})

module.exports = mongoose.model("Note", noteSchema);
