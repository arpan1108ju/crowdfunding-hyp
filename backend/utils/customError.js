export class CustomError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
