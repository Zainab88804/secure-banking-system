const pool = require("../config/db");

const logAction = async (userId, action) => {
    try {

        await pool.query(
            `INSERT INTO audit_logs
            (user_id, action)
            VALUES ($1,$2)`,
            [userId, action]
        );

    } catch (error) {
        console.error("Audit Log Error:", error);
    }
};

module.exports = logAction;