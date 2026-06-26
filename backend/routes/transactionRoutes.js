const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    transferMoney,
    getTransactionHistory
} = require("../controllers/transactionController");

router.post(
    "/transfer",
    authMiddleware,
    transferMoney
);

router.get(
    "/history",
    authMiddleware,
    getTransactionHistory
);

module.exports = router;