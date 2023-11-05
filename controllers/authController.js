const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  //expecting a user name and a password
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username }).exec();

  //if we dont find a user or if they are there an is not active, since this is a log in screen. not a sign up screen. and we dont need a sign up screen since the admin adds users him self
  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //keeping the message back vague is good,
  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  //defining access token, signing in, the object has the user information
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET, //adding the access token
    { expiresIn: "15m" } //setting it to expire in 15 minutes
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } //expire in 7 days. as per stakeholder's request, for testing set it to a shorter time to see the behavior
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refreshToken
  });

  // Send accessToken containing username and roles
  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken, //refresh token variable
    process.env.REFRESH_TOKEN_SECRET, //the secret that we have
    asyncHandler(async (err, decoded) => {
      //async handler to catch any error
      if (err) return res.status(403).json({ message: "Forbidden" }); //error from the verify process

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec(); //this should be inside the refresh token.

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" }); //if the user is not within the database, then throw this

      const accessToken = jwt.sign(
        //creating new access token which is set to expire in 15 minutes., so everytime that this expires, as long as the user has the refresh token from the http secure cookie, it will renew the accesstoken
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //passin all the same options that we did when we created the cookie
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
