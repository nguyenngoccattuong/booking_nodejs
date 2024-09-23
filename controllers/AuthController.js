const Controller = require("./Controller");
const UserModel = require("../models/UserModel");

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

class AuthController extends Controller {
  constructor(req, res) {
    super(req, res);
  }
  async login() {
    const { phone, password } = this.req.body;

    if (!phone) {
      return this.response(422, "Số điện thoại không được rỗng");
    }

    if (!password) {
      return this.response(422, "Mật khẩu không được rỗng!");
    }

    const userModel = new UserModel();

    const getPhone = await userModel.getPhone(phone);

    if (getPhone && getPhone.length == 0) {
      return this.response(422, "Số điện thoại không tồn tại!");
    }

    const oldPassword = getPhone[0].password;
    const result = bcrypt.compareSync(password, oldPassword);

    if (!result) {
      return this.response(422, "Sai mật khẩu!");
    }

    return this.response(200, result);
  }
}

module.exports = AuthController;
