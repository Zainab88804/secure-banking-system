const pool = require("../config/db");
const logAction = require("../utils/auditLogger");

const transferMoney = async (req, res) => {
    const client = await pool.connect();
    try {
        const senderId = req.user.id;
        const { receiverId, amount, note } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        await client.query("BEGIN");

        const senderResult = await client.query(
            "SELECT balance FROM users WHERE id=$1", [senderId]
        );

        const senderBalance = senderResult.rows[0].balance;

        if (senderBalance < amount) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Insufficient balance" });
        }

        await client.query(
            "UPDATE users SET balance = balance - $1 WHERE id=$2",
            [amount, senderId]
        );

        const receiverResult = await client.query(
            "UPDATE users SET balance = balance + $1 WHERE id=$2 RETURNING id",
            [amount, receiverId]
        );

        if (receiverResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Receiver not found" });
        }

        await client.query(
            `INSERT INTO transactions (sender_id, receiver_id, amount, note)
            VALUES ($1,$2,$3,$4)`,
            [senderId, receiverId, amount, note]
        );

        // ✅ FRAUD RULE 1 — Large Transaction
if (amount > 50000) {
    await client.query(
        `INSERT INTO fraud_alerts (user_id, alert_type, description)
        VALUES ($1,$2,$3)`,
        [senderId, "Large Transaction",
        `Transfer of Rs.${amount} exceeded threshold`]
    );
}

// ✅ FRAUD RULE 2 — Multiple Transfers in 1 minute
const recentTransfers = await pool.query(
    `SELECT COUNT(*) FROM transactions
     WHERE sender_id=$1
     AND created_at > NOW() - INTERVAL '1 minute'`,
    [senderId]
);

if (parseInt(recentTransfers.rows[0].count) >= 5) {
    await pool.query(
        `INSERT INTO fraud_alerts (user_id, alert_type, description)
        VALUES ($1,$2,$3)`,
        [senderId, "Multiple Transfers",
        `User made 5+ transfers within 1 minute`]
    );
}

        await client.query("COMMIT");

        // ✅ AUDIT LOG - COMMIT ke baad
        await logAction(
            senderId,
            `Transferred Rs.${amount} to User ${receiverId}`
        );

        res.json({ message: "Transfer successful" });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
};

const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT *
             FROM transactions
             WHERE sender_id=$1 OR receiver_id=$1
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json({ transactions: result.rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    transferMoney,
    getTransactionHistory
};