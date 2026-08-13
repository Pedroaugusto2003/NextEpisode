import mysql from "mysql2/promise";

export const conexao = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "nextepisode",
  waitForConnections: true,
  connectionLimit: 10,
});
