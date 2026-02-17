const statusCodes = require('http-status-codes');
const BaseError = require('./Base.err');
const { StatusCodes } = require('status-codes');
class InternalError extends BaseError {
  constructor(methodName) {
    super('Internal Server Error', statusCodes.InternalServerError, {});
  }
}
module.exports = InternalError;
