class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode; // ✅ Fix: use camelCase
    this.data = null;
    this.success = false;
    this.errors = errors;
    this.errorMessage = message;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      data: this.data,
      success: this.success,
      errors: this.errors,
      message: this.message,
    };
  }
}


export default ApiError