class Controller {
  req;
  res;

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  success(statusCode = 200, data = []) {
    return {
      statusCode: statusCode,
      success: true,
      message: "Success",
      data: data,
    };
  }

  error(statusCode = 422, error = []) {
    return {
      statusCode: statusCode,
      success: true,
      message: "Error",
      error: error,
    };
  }

  response(statusCode, data = []) {
    return this.res.send(
      statusCode == 200
        ? this.success(statusCode, data)
        : this.error(statusCode, data)
    );
  }
}

module.exports = Controller;
