const pool = require("../config/db");

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT id, fullname, email, balance, role, status, created_at
            FROM users WHERE id=$1`,
            [userId]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getLoginHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM login_history
             WHERE user_id=$1
             ORDER BY login_time DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await pool.query(
            `SELECT id, fullname, email, balance, role, status
             FROM users WHERE id=$1`, [userId]
        );

        const recentTransactions = await pool.query(
            `SELECT * FROM transactions
             WHERE sender_id=$1 OR receiver_id=$1
             ORDER BY created_at DESC LIMIT 5`,
            [userId]
        );

        const fraudCount = await pool.query(
            `SELECT COUNT(*) FROM fraud_alerts
             WHERE user_id=$1`, [userId]
        );

        res.json({
            profile: profile.rows[0],
            balance: profile.rows[0].balance,
            recentTransactions: recentTransactions.rows,
            fraudAlerts: parseInt(fraudCount.rows[0].count)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ DONO export karo
module.exports = { getProfile, getLoginHistory, getDashboard };