import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
let db;
try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  console.log("MySQL Connected...");
} catch (err) {
  console.error(" Database connection failed:", err.message);
}

export default db;
