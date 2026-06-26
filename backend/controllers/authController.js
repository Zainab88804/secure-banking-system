const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const logAction = require("../utils/auditLogger");

const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1", [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            `INSERT INTO users (fullname,email,password_hash)
            VALUES($1,$2,$3) RETURNING *`,
            [fullname, email, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query(
            "SELECT * FROM users WHERE email=$1", [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const user = userResult.rows[0];

        if (user.status === "locked") {
            return res.status(403).json({ message: "Account Locked" });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            const failedAttempts = user.failed_attempts + 1;

            if (failedAttempts >= 5) {
                await pool.query(
                    `UPDATE users SET failed_attempts=$1, status='locked' WHERE id=$2`,
                    [failedAttempts, user.id]
                );
                return res.status(403).json({
                    message: "Account Locked due to multiple failed login attempts"
                });
            }

            await pool.query(
                `UPDATE users SET failed_attempts=$1 WHERE id=$2`,
                [failedAttempts, user.id]
            );

            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        await pool.query(
            "UPDATE users SET failed_attempts=0 WHERE id=$1", [user.id]
        );

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        await logAction(user.id, "User Login");

        // ✅ LOGIN HISTORY - function ke andar
        await pool.query(
            `INSERT INTO login_history(user_id) VALUES($1)`,
            [user.id]
        );

        res.json({ message: "Login Successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { register, login };