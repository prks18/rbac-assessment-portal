const User = require("../Models/User");
const jwt = require("jsonwebtoken");

let maxAge = 3 * 24 * 60 * 60;

// @desc GET login when not authorised
// @route  GET /
// @access Public

module.exports.redirect = (req, res, next) => {
  res.redirect("/login");
  next();
};

// @desc GET signup page
// @route  GET/signup
// @access Public

module.exports.signup_get = (req, res) => {
  res.render("signup", { err: req.query.err || null });
};

// @desc GET login page
// @route  GET/login
// @access Public

module.exports.login_get = (req, res) => {
  res.render("login", { err: req.query.err || null });
};

// @desc POST signup page
// @route  POST/signup
// @access Public

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password }); //creating and saving user to db
    //creating jwt token and setting it to the cookie
    let token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ success: "User created and saved!" });
  } catch (err) {
    let errors = handleErrors(err);
    res.status(422).json({ errors });
  }
};

// @desc POST login page
// @route  POST/login
// @access Public

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    console.log(user);
    let token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ success: "User loggedin!", user: user });
  } catch (err) {
    let errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

// @desc Verifies Token for every Route
// @route   Custom Middleware called by every Route
// @access Private

module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  //check json web token exists & if its verified
  if (token) {
    jwt.verify(token, "my secret phrase", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// @desc Logs out the user by emptying JWT
// @route  GET/logout
// @access Public

module.exports.logout_get = (req, res, next) => {
  //Setting cookie to null to remove it
  res.cookie("token", "", { maxAge: 1 });
  res.redirect("/login");
};

// @desc Handles Errors
// @route  Utility function
// @access Private

function handleErrors(errObj) {
  console.log(errObj, errObj.message, errObj.code);
  let errors = {
    error: "",
  };
  if (errObj.code == 11000) {
    errors.error = "User already exists";
    return errors;
  }
  if (errObj.message.includes("user validation failed")) {
    errors.error = "Email/password is incorrect";
  } else {
    errors.error = errObj.message;
  }
  return errors;
}

// @desc  Creates JWT Token
// @route  Utility Function
// @access Private

function createToken(id) {
  return jwt.sign({ id }, "my secret phrase", { expiresIn: maxAge });
}
