// 自定义404错误类
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

// 封装成功的响应
function success(res, message, data = {}, code = 200) {
  return res.json({
    status: true,
    message,
    data,
  });
}

// 封装失败的响应
function failure(res, error) {
  if (error.name == "SequelizeValidationError") {
    const errors = error.errors.map((err) => err.message);
    res.status(400).json({
      status: false,
      message: "请求参数错误",
      errors,
    });
  }

  if (error.name == "NotFoundError") {
    return res.status(404).json({
      status: false,
      message: "资源不存在",
      errors: [error.message],
    });
  }

  res.status(500).json({
    status: false,
    message: "服务器错误",
    errors: [error.message],
  });
}

module.exports = {
  NotFoundError,
  success,
  failure,
};
