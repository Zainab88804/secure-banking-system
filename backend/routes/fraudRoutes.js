const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { getFraudAlerts } = require("../controllers/fraudController");

router.get("/alerts", authMiddleware, adminMiddleware, getFraudAlerts);

module.exports = router;