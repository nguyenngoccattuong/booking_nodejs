const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
// const secret = process.env.JWT_SECRET;

require("dotenv").config();

const Controller = require("./Controller");
const UserModel = require("../models/UserModel");

class AuthController extends Controller {
  constructor(req, res, next) {
    super(req, res, next);
  }

  async login() {
    try {
      const { phone, password } = this.req.body;

      if (!phone) {
        return this.response(422, "Số Điện Thoại không được rỗng");
      }

      if (!password) {
        return this.response(422, "Mật Khẩu không được rỗng");
      }

      const userModel = new UserModel();

      const getPhone = await userModel.getPhone(phone);

      if (getPhone && getPhone.length == 0) {
        return this.response(422, "Số Điện Thoại không tồn tại");
      }

      const oldPassword = getPhone[0].password;
      const result = bcrypt.compareSync(password, oldPassword);

      if (!result) {
        return this.response(422, "Tài khoản không tồn tại");
      }

      const data = await userModel.findOne(getPhone[0].id);

      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: data[0],
        },
        secret
      );

      console.log("data:", data);
      console.log("JWT_SECRET:", secret); // Kiểm tra giá trị của secret

      return this.response(200, { token });
    } catch (error) {
      return this.response(500, error);
    }
  }

  authorization() {
    const auth = this.req.header("authorization");

    if (!auth) {
      return this.response(401, "Vui lòng nhập Token");
    }

    const split_auth = auth.split(" "); // chuyển chuỗi => mảng
    const token = split_auth[1];

    try {
      jwt.verify(token, process.env.SECRET);
      return this.next();
    } catch (err) {
      return this.response(401, "Token hết hạn");
    }
  }
}

module.exports = AuthController;
