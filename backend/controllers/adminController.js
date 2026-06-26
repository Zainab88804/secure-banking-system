const pool = require("../config/db");

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, fullname, email, role, balance, status
             FROM users ORDER BY id`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const freezeUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await pool.query(
            `UPDATE users SET status='locked' WHERE id=$1`, [userId]
        );
        res.json({ message: "Account Frozen" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const unfreezeUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await pool.query(
            `UPDATE users SET status='active', failed_attempts=0 WHERE id=$1`,
            [userId]
        );
        res.json({ message: "Account Unfrozen" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
const getAllTransactions = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.*, 
             s.fullname as sender_name,
             r.fullname as receiver_name
             FROM transactions t
             JOIN users s ON t.sender_id = s.id
             JOIN users r ON t.receiver_id = r.id
             ORDER BY t.created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAdminFraudAlerts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM fraud_alerts ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAdminAuditLogs = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM audit_logs ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { 
    getAllUsers, 
    freezeUser, 
    unfreezeUser,
    getAllTransactions,
    getAdminFraudAlerts,
    getAdminAuditLogs
};
