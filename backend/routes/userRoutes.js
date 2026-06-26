const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, getLoginHistory, getDashboard } = require("../controllers/userController");

router.get("/profile", authMiddleware, getProfile);
router.get("/login-history", authMiddleware, getLoginHistory);
router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;