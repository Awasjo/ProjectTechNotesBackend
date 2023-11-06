const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler"); //keep us from uysing try catch blocks
const bcrypt = require("bcrypt"); //help us hash the passwords before they are added to the database

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean(); //we will try to find a user, and we want to make sure we dont get a password returned and also we want to make it lean return so it just returns json
  if (!users?.length) {
    return res.status(400).json({ message: "User not found" });
  }
  res.json(users);
});
// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  //confirm the data
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //check for duplicates
  const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec(); //if we use async await we need to call exec at the end, collation checks for case insensitivity, so cases doesn't matter 

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10); //salt rounds is set at 10 here

  const userObject = (!Array.isArray(roles) || !roles.length) //this change is related tot he above change, if we have the roles, we populate it and if we don't then its all, since by default everyone gets employee 
  ? { username, "password": hashedPwd }
  : { username, "password": hashedPwd, roles }

  //create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});
// @desc update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  //check for duplicates
  const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
  //allow updated to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    //hash password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});
// @desc delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user still have assigned notes?
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  //we dont use lean here because we need those other function that this would originally send back
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Store the information about the user before deletion
  const deletedUserInfo = {
    username: user.username,
    _id: user._id,
  };

  await user.deleteOne();

  const reply = `Username ${deletedUserInfo.username} with ID ${deletedUserInfo._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
