const { Router } = require("express");
const router = Router();
const studentController = require("../Controllers/StudentController");
const authController = require("../Controllers/AuthController");
const { checkStudentAccess } = require("../Middlewares/CheckStudentAccess");
const requireAuth = authController.verifyToken;

router.get(
  "/home",
  requireAuth,
  checkStudentAccess,
  studentController.home_get
);
router.get(
  "/getmcq",
  requireAuth,
  checkStudentAccess,
  studentController.mcq_get
);
router.post(
  "/postmcq",
  requireAuth,
  checkStudentAccess,
  studentController.post_mcq
);

router.get(
  "/getassessments",
  requireAuth,
  checkStudentAccess,
  studentController.assessment_get
);

module.exports = router;
