const { Router } = require("express");
const router = Router();
const authController = require("../Controllers/AuthController");
const AdminController = require("../Controllers/AdminController");
const requireAuth = authController.verifyToken;
const { checkAdminAccess } = require("../Middlewares/CheckAdminAccess");

router.get("/home", requireAuth, checkAdminAccess, AdminController.get_home);
router.get(
  "/createmcq",
  requireAuth,
  checkAdminAccess,
  AdminController.create_mcq_get
);
router.post(
  "/createmcq",
  requireAuth,
  checkAdminAccess,
  AdminController.create_mcq_post
);

router.get(
  "/editmcq",
  requireAuth,
  checkAdminAccess,
  AdminController.edit_mcq_get
);
router.post(
  "/editmcq",
  requireAuth,
  checkAdminAccess,
  AdminController.edit_mcq_post
);
router.get(
  "/deletemcq",
  requireAuth,
  checkAdminAccess,
  AdminController.delete_mcq_get
);

router.get(
  "/editassessment",
  requireAuth,
  checkAdminAccess,
  AdminController.edit_assessment_get
);

router.post(
  "/editassessment",
  requireAuth,
  checkAdminAccess,
  AdminController.edit_assessment_post
);

router.get(
  "/deleteassessment",
  requireAuth,
  checkAdminAccess,
  AdminController.delete_assessment_get
);
router.get(
  "/createAssessment",
  requireAuth,
  checkAdminAccess,
  AdminController.create_assessment_get
);
router.post(
  "/createAssessment",
  requireAuth,
  checkAdminAccess,
  AdminController.create_assessment_post
);

router.get(
  "/createcreator",
  requireAuth,
  checkAdminAccess,
  AdminController.create_creator_get
);

router.post(
  "/createcreator",
  requireAuth,
  checkAdminAccess,
  AdminController.create_creator_post
);

router.get(
  "/deletecreator",
  requireAuth,
  checkAdminAccess,
  AdminController.delete_creator_get
);

module.exports = router;
