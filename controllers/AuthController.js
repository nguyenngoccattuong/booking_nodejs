const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET; // Đảm bảo rằng SECRET được cấu hình trong .env

require("dotenv").config();

const Controller = require("./Controller");
const UserModel = require("../models/UserModel");
const TokenModel = require("../models/TokenModel");

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

      // Lưu token vào cơ sở dữ liệu với trạng thái 1 (active)
      const tokenModel = new TokenModel();
      await tokenModel.run(token, data[0].id);

      return this.response(200, { token });
    } catch (error) {
      return this.response(500, error);
    }
  }

  async logout() {
    try {
      const auth = this.req.header("authorization");
      if (!auth) {
        return this.response(401, "Vui lòng nhập Token");
      }

      const token = auth.split(" ")[1]; // Lấy token từ header
      const decoded = jwt.verify(token, secret);
      const userId = decoded.data.id;

      const tokenModel = new TokenModel();
      await tokenModel.updateStatus(token, 0);

      return this.response(200, "Đăng xuất thành công");
    } catch (err) {
      return this.response(401, "Token không hợp lệ hoặc đã hết hạn");
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
      jwt.verify(token, secret);
      return this.next();
    } catch (err) {
      return this.response(401, "Token không hợp lệ hoặc đã hết hạn");
    }
  }

  // Hàm kiểm tra token
  async checkToken() {
    try {
      const auth = this.req.header("authorization");
      if (!auth) {
        return this.response(401, "Vui lòng nhập Token");
      }

      const token = auth.split(" ")[1]; // Lấy token từ header
      const decoded = jwt.verify(token, secret); // Giải mã token
      const userId = decoded.data.id; // Lấy user ID từ token

      const tokenModel = new TokenModel();

      // Kiểm tra token trong cơ sở dữ liệu
      const tokenStatus = await tokenModel.findStatus(1, userId); // Tìm token có status = 1 và created_by = userId

      // Nếu không tìm thấy token hoặc không tồn tại, trả về lỗi
      if (!tokenStatus || tokenStatus.length === 0) {
        return this.response(403, "Token không hợp lệ hoặc đã hết hạn.");
      }
      return this.next();
    } catch (error) {
      return this.response(401, "Token không hợp lệ hoặc đã hết hạn.");
    }
  }
}

module.exports = AuthController;
