const Model = require("./Model");

class TokenModel extends Model {
  async create(data, created_by) {
    const sql =
      "INSERT INTO token (token, status, created_by) VALUES (?, ?, ?)";
    const [result] = await this.connection.query(sql, [
      data.token,
      data.status,
      created_by,
    ]);
    const insertedId = result.insertId;
    const selectSql = "SELECT * FROM token WHERE id = ?";
    const [query] = await this.connection.query(selectSql, [insertedId]);
    return query[0];
  }

  async updateToken(created_by) {
    const sql = "UPDATE token SET status = 0 WHERE created_by = ?";
    const [result] = await this.connection.query(sql, [created_by]);
    return result.affectedRows > 0;
  }

  async updateStatus(token, status) {
    const sql = "UPDATE token SET status = ? WHERE token = ?";
    await this.connection.query(sql, [status, token]);
  }

  async findStatus(status) {
    const sql = "SELECT id FROM token WHERE status = ?";
    const [data] = await this.connection.query(sql, status);
    return data;
  }
  async run(token, id) {
    const conn = await this.connection.getConnection();
    try {
      await conn.beginTransaction();
      await this.updateToken(id);
      await this.create({ token, status: 1 }, id);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
    }
  }
}

module.exports = TokenModel;
