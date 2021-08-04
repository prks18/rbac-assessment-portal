const jwt = require("jsonwebtoken");
const User = require("../Models/User");
// @desc verifies route has role access
// @route  Called for special access routes
// @access Private

module.exports.checkCreatorAccess = (req, res, next) => {
  const token = req.cookies.token;

  //decoding jwt token
  if (token) {
    jwt.verify(token, "my secret phrase", async (err, decodedToken) => {
      if (err) {
        let error = "Error Occurred. Please Try Later.";
        console.log(err.message);
        res.cookie("token", "", { maxAge: 1 });
        res.redirect("/login?err=" + error);
      } else {
        const user = await User.findById(decodedToken.id);

        if (user.role === "contentCreator" || user.role === "admin") {
          next();
        } else {
          let err = "You are not authorised to view the page";
          res.redirect(`/${user.role}/home?err=` + err);
        }
      }
    });
  } else {
    let err = "You are not authorised to view the page";
    res.redirect("/login?err=" + err);
  }
};
