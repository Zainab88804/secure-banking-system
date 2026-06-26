const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const fraudRoutes = require("./routes/fraudRoutes");
const auditRoutes = require("./routes/auditRoutes");
const adminRoutes = require("./routes/adminRoutes");
const otpRoutes = require("./routes/otpRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
const transactionRoutes = require("./routes/transactionRoutes");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/beneficiary", beneficiaryRoutes);

app.get("/", (req, res) => {
    res.send("Secure Banking System API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});