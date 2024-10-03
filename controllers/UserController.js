const Controller = require("./Controller");
const UserModel = require("../models/UserModel");
const TokenModel = require("../models/TokenModel");

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

class UserController extends Controller {
  constructor(req, res) {
    super(req, res);
  }

  async findAll() {
    try {
      const userModel = new UserModel();
      const phone = this.req.query.phone;

      const sort_name =
        this.req.query.sort_name ?? process.env.SORT_NAME_DEFAULT;
      const sort_type =
        this.req.query.sort_type ?? process.env.SORT_TYPE_DEFAULT;

      const page = parseInt(this.req.query.page ?? process.env.PAGE_DEFAULT);
      const limit = parseInt(this.req.query.limit ?? process.env.LIMIT_DEFAULT);

      const skip = (page - 1) * limit;

      const data = await userModel.findAll(
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
      const userModel = new UserModel();
      const data = await userModel.findOne(id);

      return this.response(200, data);
    } catch (error) {
      return this.response(500, error);
    }
  }

  async create() {
    try {
      const created_by = this.auth_user_id();

      let { phone, password } = this.req.body;

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

      const user_model = new UserModel();

      const check_phone = await user_model.check_phone(phone);
      if (check_phone) {
        return this.response(400, "Số điện thoại đã tồn tại!");
      }

      const data = await user_model.create(this.req.body, created_by);

      return this.response(200, data);
    } catch (error) {
      return this.response(500, error);
    }
  }

  async update(id) {
    try {
      const user_model = new UserModel();

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

module.exports = UserController;
