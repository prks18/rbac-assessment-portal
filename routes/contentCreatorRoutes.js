const { Router } = require("express");
const router = Router();
const CreatorController = require("../Controllers/CreatorController");
const authController = require("../Controllers/AuthController");
const { checkCreatorAccess } = require("../Middlewares/CheckCreatorAccess");

const requireAuth = authController.verifyToken;

router.get(
  "/home",
  requireAuth,
  checkCreatorAccess,
  CreatorController.home_creator
);

router.get(
  "/createmcq",
  requireAuth,
  checkCreatorAccess,
  CreatorController.create_mcq_get
);
router.post(
  "/createmcq",
  requireAuth,
  checkCreatorAccess,
  CreatorController.create_mcq_post
);

router.get(
  "/createAssessment",
  requireAuth,
  checkCreatorAccess,
  CreatorController.create_assessment_get
);
router.post(
  "/createAssessment",
  requireAuth,
  checkCreatorAccess,
  CreatorController.create_assessment_post
);
module.exports = router;
