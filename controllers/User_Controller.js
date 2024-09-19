const Controller = require("./Controller");
const User_Model = require("../models/User_Model");

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

class User_Controller extends Controller {
  constructor(req, res) {
    super(req, res);
  }

  findAll() {
    this.res.send({ key: "findAll" });
  }

  async findOne(id) {
    try {
      const user_model = new User_Model();
      const data = await user_model.findOne(id);

      return this.response(200, data);
    } catch (error) {
      return this.response(500, error);
    }
  }

  async create() {
    try {
      const user_model = new User_Model();

      const phone = this.req.body.phone;
      let password = this.req.body.password;

      if (!phone) {
        return this.response(400, "Số điện thoại không được rỗng");
      }

      if (phone.length > 10) {
        return this.response(400, "Số điện thoại không được lớn hơn 10");
      }

      if (!password) {
        return this.response(400, "Mật khẩu không được rỗng");
      }

      if (password.length > 100) {
        return this.response(400, "Mật khẩu không được lớn hơn 100");
      }

      const check_phone = await user_model.check_phone(phone);
      if (check_phone) {
        return this.response(400, "Số điện thoại đã tồn tại!");
      }

      password = bcrypt.hashSync(password, salt);

      const data = await user_model.create(phone, password);

      return this.response(200, data);
    } catch (error) {
      return this.response(500, error);
    }
  }

  async update(id) {
    try {
      const user_model = new User_Model();

      let password = this.req.body.password;

      password = bcrypt.hashSync(password, salt);

      const data = await user_model.update(id, password);

      return this.response(200, data);
    } catch (error) {
      return this.response(500, error);
    }
  }

  delete(id) {
    this.res.send({ key: "delete" });
  }
}

module.exports = User_Controller;
