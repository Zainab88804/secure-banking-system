const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addBeneficiary, getBeneficiaries, deleteBeneficiary } = require("../controllers/beneficiaryController");

router.post("/add", authMiddleware, addBeneficiary);
router.get("/list", authMiddleware, getBeneficiaries);
router.delete("/delete/:id", authMiddleware, deleteBeneficiary);

module.exports = router;