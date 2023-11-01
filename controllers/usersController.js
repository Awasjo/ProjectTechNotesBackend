const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler'); //keep us from uysing try catch blocks
const bcrypt = require('bcrypt') //help us hash the passwords before they are added to the database


// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async(req, res) =>{

})
// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async(req, res) =>{

})
// @desc update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async(req, res) =>{

})
// @desc delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async(req, res) =>{

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}