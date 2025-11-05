class ApiResponse {
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.statusCode = statusCode;
    this.status = 'success';
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }

  static success(data, message = 'Success', meta = null) {
    return new ApiResponse(200, data, message, meta);
  }

  static created(data, message = 'Created successfully') {
    return new ApiResponse(201, data, message);
  }

  static error(statusCode, message, errors = []) {
    return {
      statusCode,
      status: 'error',
      message,
      errors
    };
  }

  static paginated(data, page, limit, total) {
    const meta = {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    };
    return new ApiResponse(200, data, 'Success', meta);
  }
}

module.exports = ApiResponse;
