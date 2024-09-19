class Controller {
  req;
  res;

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  success(data = []) {
    return {
      success: true,
      message: "Success",
      data: data,
    };
  }

  error(error = []) {
    return {
      success: true,
      message: "Error",
      error: error,
    };
  }

  response(status, data = []) {
    return this.res.send(status == 200 ? this.success(data) : this.error(data));
  }
}

module.exports = Controller;
