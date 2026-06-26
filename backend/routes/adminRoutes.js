const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  freezeUser,
  unfreezeUser,
  getAllTransactions,
  getAdminFraudAlerts,
  getAdminAuditLogs
} = require("../controllers/adminController");

// ✅ ALL ROUTES MUST USE BOTH MIDDLEWARES
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

router.put("/freeze/:id", authMiddleware, adminMiddleware, freezeUser);

router.put("/unfreeze/:id", authMiddleware, adminMiddleware, unfreezeUser);

router.get("/transactions", authMiddleware, adminMiddleware, getAllTransactions);

router.get("/fraud", authMiddleware, adminMiddleware, getAdminFraudAlerts);

router.get("/logs", authMiddleware, adminMiddleware, getAdminAuditLogs);

module.exports = router;