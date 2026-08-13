import mysql from "mysql2/promise";

export const conexao = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "mysql",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "nextepisode",
  waitForConnections: true,
  connectionLimit: 10,
});
