const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    generateOTP,
    verifyOTP
} = require("../controllers/otpController");

router.post(
    "/generate",
    authMiddleware,
    generateOTP
);

router.post(
    "/verify",
    authMiddleware,
    verifyOTP
);

module.exports = router;