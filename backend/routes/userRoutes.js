const express = require("express");
const router = express.Router();
const { profileSetup, upload } = require("../users/profileSetup");
const register = require("../users/register");
const login = require("../users/login");
const editUserInfo = require("../users/editUserInfo");
const deleteAccount = require("../users/deleteAccount");
const logout = require("../users/logout");
const checkLogin = require("../users/checkLogin");
const authMiddleware = require("../middleware/authMiddleware");
const { getStreak } = require("../users/streak");
const verifyEmail = require("../users/verifyEmail");
const resendVerification = require("../users/resendVerification");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/resend-verification", resendVerification);

router.get("/verify-email", verifyEmail);

// Protected routes
router.post(
  "/profile-setup",
  authMiddleware,
  upload.single("profilePicture"),
  profileSetup
);

router.put(
  "/edit-user-info",
  authMiddleware,
  upload.single("profilePicture"),
  editUserInfo
);

router.delete("/delete-account", authMiddleware, deleteAccount);
router.get("/check-login", authMiddleware, checkLogin);
router.post("/logout", authMiddleware, logout);
router.get("/streak/current", authMiddleware, getStreak);

module.exports = router;
