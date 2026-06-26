const pool = require("../config/db");

const addBeneficiary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { beneficiary_id } = req.body;

        if (userId === parseInt(beneficiary_id)) {
            return res.status(400).json({ message: "Cannot add yourself" });
        }

        await pool.query(
            `INSERT INTO beneficiaries (user_id, beneficiary_id)
            VALUES ($1,$2)`,
            [userId, beneficiary_id]
        );

        res.json({ message: "Beneficiary added successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getBeneficiaries = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT b.id, u.fullname, u.email
             FROM beneficiaries b
             JOIN users u ON b.beneficiary_id = u.id
             WHERE b.user_id = $1`,
            [userId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteBeneficiary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await pool.query(
            `DELETE FROM beneficiaries WHERE id=$1 AND user_id=$2`,
            [id, userId]
        );

        res.json({ message: "Beneficiary removed" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { addBeneficiary, getBeneficiaries, deleteBeneficiary };