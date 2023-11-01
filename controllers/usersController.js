const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler'); //keep us from uysing try catch blocks
const bcrypt = require('bcrypt') //help us hash the passwords before they are added to the database


// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async(req, res) =>{
    const users = await User.find().select('-password').lean() //we will try to find a user, and we want to make sure we dont get a password returned and also we want to make it lean return so it just returns json
    if(!users){
        return res.status(400).json({message: 'User not found'})
    }
    res.json(users)
})
// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async(req, res) =>{
    const {username, password, roles } = req.body
    //confirm the data
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: 'All fields are required'})
    }
    //check for duplicates
    const duplicate = await User.findOne({username}).lean().exec() //if we use async await we need to call exec at the end

    if(duplicate){
        return res.status(409).json({message: 'Duplicate username'})
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password,10)//salt rounds is set at 10 here

    const userObject = {username, "password": hashedPassword, roles}

    //create and store new user
    const user = await User.create(userObject)

    if(user){
        //created
        res.status(201).json({ message : `New user ${username} created`})
    }else{
        res.status(400).json({message: 'Invalid user data received'})
    }
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