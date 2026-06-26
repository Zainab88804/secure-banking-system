const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function main() {
    try {
        console.log("Connecting to PG...");
        await pool.connect();
        console.log("Connected.");

        console.log("\n--- Tables List ---");
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public'
        `);
        console.log(JSON.stringify(tablesRes.rows));

        for (const row of tablesRes.rows) {
            const tableName = row.table_name;
            console.log(`\n--- Schema of ${tableName} ---`);
            const colsRes = await pool.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name=$1
            `, [tableName]);
            console.log(JSON.stringify(colsRes.rows));
        }

        console.log("\n--- Users in Database ---");
        const usersRes = await pool.query("SELECT id, fullname, email, balance, role, status FROM users");
        console.log(JSON.stringify(usersRes.rows));

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await pool.end();
    }
}

main();
