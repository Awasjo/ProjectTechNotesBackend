const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter.js");

router
  .route("/") //this will be at /auth, the login limiter will be called when we post from the auth url, this will give the client a short time token, which will then be used to grant a refresh token. this tokens will be stored in the application state, so when the application is closed, these tokens are lost
  .post(loginLimiter, authController.login);
//the tokens above and below were required by using require('crypto').randomBytes(64).toString('hex') in the node
router
  .route("/refresh") //gives a token to the client application that will last a long time, so that the user doesn't have to log back in, this will be sent as httpOnly cookie, this will come into our REST api and validated it, if its valid, then the user will get a new json web token above, the refresh token will expire at some point
  .get(authController.refresh);

router.route("/logout").post(authController.logout);

module.exports = router;
