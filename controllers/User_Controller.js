const Controller = require("./Controller");
const User_Model = require("../models/User_Model");

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

class User_Controller extends Controller {
  constructor(req, res) {
    super(req, res);
  }

  async findAll() {
    return this.response(200, this.req.params);
    try {
      const user_model = new User_Model();

      const phone = this.req.query.phone;

      const sort_name =
        this.req.query.sort_name ?? process.env.SORT_NAME_DEFAULT;
      const sort_type =
        this.req.query.sort_type ?? process.env.SORT_TYPE_DEFAULT;

      const page = parseInt(this.req.query.page ?? process.env.PAGE_DEFAULT);
      const limit = parseInt(this.req.query.limit ?? process.env.LIMIT_DEFAULT);

      const skip = (page - 1) * limit;

      const data = await user_model.findAll(
        phone,
        sort_name,
        sort_type,
        limit,
        skip
      );

      return this.response(200, data);
    } catch (error) {
      return this.response(500, error);
    }
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

      if (!id) {
        return this.response(500, "Id không được rỗng");
      }

      if (!password) {
        return this.response(500, "Mật khẩu không được rỗng");
      }

      if (password.length > 100) {
        return this.response(500, "Mật khẩu không được lớn hơn 100");
      }

      password = bcrypt.hashSync(password, salt);

      const data = await user_model.update(id, password);

      return this.response(200, data);
    } catch (error) {
      return this.response(500, error);
    }
  }

  async delete(id) {
    try {
      const user_model = new User_Model();

      if (!id) {
        return this.response(500, "Id không được rỗng");
      }

      const data = await user_model.delete(id);

      return this.response(200, data);
    } catch (error) {
      return this.response(500, error);
    }
  }
}

module.exports = User_Controller;
