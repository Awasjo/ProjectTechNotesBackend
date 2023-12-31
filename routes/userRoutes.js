const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)
//now we are at the users route, below will show the users route
router.route("/")
.get(usersController.getAllUsers)
.post(usersController.createNewUser)
.patch(usersController.updateUser)
.delete(usersController.deleteUser);

module.exports = router;
