const pool = require("../database/connect");

class User_Model {
  findAll() {
    return "findAll";
  }

  async findOne(id) {
    const sql = "SELECT id, phone FROM users WHERE id = ?";
    const [data] = await pool.query(sql, [id]);
    return data[0];
  }

  async create(phone, password) {
    const sql = "INSERT INTO users (phone, password) VALUES (?, ?)";
    const [result] = await pool.query(sql, [phone, password]);

    const insertedId = result.insertId;

    const selectSql = "SELECT * FROM users WHERE id = ?";
    const [data] = await pool.query(selectSql, [insertedId]);

    return data[0];
  }

  async update(id, password) {
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    await pool.query(sql, [password, id]);

    const selectSql = "SELECT * FROM users WHERE id = ?";
    const [data] = await pool.query(selectSql, [id]);

    return data[0];
  }

  delete(id) {
    return "findAll";
  }

  async check_phone(phone) {
    const sql = "SELECT id FROM users WHERE phone = ?";
    const [data] = await pool.query(sql, [phone]);
    return data[0] ? true : false;
  }
}

module.exports = User_Model;
