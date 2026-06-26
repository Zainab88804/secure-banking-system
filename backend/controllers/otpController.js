const pool = require("../config/db");

const generateOTP = async (req, res) => {

    try {

        const userId = req.user.id;

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        await pool.query(
            `INSERT INTO otp_verifications
            (user_id, otp_code, expires_at)
            VALUES ($1,$2,$3)`,
            [userId, otp, expiresAt]
        );

        res.json({
            message: "OTP Generated",
            otp // demo only
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};
const verifyOTP = async (req, res) => {

    try {

        const userId = req.user.id;
        const { otp } = req.body;

        const result = await pool.query(
            `SELECT *
             FROM otp_verifications
             WHERE user_id=$1
             ORDER BY id DESC
             LIMIT 1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "No OTP found"
            });
        }

        const record = result.rows[0];

        if (record.otp_code !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (new Date() > record.expires_at) {
            return res.status(400).json({
                message: "OTP Expired"
            });
        }

        await pool.query(
            `UPDATE otp_verifications
             SET verified=TRUE
             WHERE id=$1`,
            [record.id]
        );

        res.json({
            message: "OTP Verified Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    generateOTP,
    verifyOTP
};