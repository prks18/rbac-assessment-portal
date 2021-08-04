const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// @desc Identifies current User
// @route  Called by all routes universally
// @access Private

module.exports.identifyUser = (req, res, next) => {
  const token = req.cookies.token;

  //check json web token exists & if its verified

  if (token) {
    jwt.verify(token, "my secret phrase", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
      } else {
        try {
          const user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        } catch (err) {
          console.error("User not found!");
          res.locals.user = null;
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
