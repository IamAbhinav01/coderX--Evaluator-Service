const statusCodes = require('http-status-codes');
const BaseError = require('./Base.err');
const { StatusCodes } = require('status-codes');
class NotFoundError extends BaseError {
  constructor(methodName) {
    super('Not Found', statusCodes.NotFound, {});
  }
}
module.exports = NotFoundError;
