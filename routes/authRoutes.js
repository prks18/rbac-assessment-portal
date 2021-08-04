const { Router } = require("express");
const authController = require("../Controllers/AuthController");
const { identifyUser } = require("../Middlewares/IdentifyUser");
const router = Router();

router.get("*", identifyUser);
router.get("/", authController.redirect);
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

module.exports = router;
