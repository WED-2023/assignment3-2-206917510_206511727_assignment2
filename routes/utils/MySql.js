require("dotenv").config(); // Load .env
const mysql = require("mysql2");

const config = {
  connectionLimit: 4,
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
};

// DEBUG: Print the config to confirm .env loaded correctly
console.log("🧪 DB CONFIG:", config);

const pool = mysql.createPool(config);

// For routes using .connection()
const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      console.log("✅ MySQL connected: threadId", connection.threadId);

      const query = (sql, binding) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      };

      const release = () => {
        return new Promise((resolve, reject) => {
          console.log("🔁 MySQL released: threadId", connection.threadId);
          resolve(connection.release());
        });
      };

      resolve({ query, release });
    });
  });
};

// For simple use: query(sql, [params])
const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = { pool, connection, query };
