const pool = require("../config/db");

const getFraudAlerts = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM fraud_alerts
             ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    getFraudAlerts
};