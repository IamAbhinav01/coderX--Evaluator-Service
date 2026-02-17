const statusCodes = require('http-status-codes');
const BaseError = require('./Base.err');
const { StatusCodes } = require('status-codes');
class NotImplemented extends BaseError {
  constructor(methodName) {
    super('Not Implemented', statusCodes.NotImplemented, {});
  }
}
module.exports = NotImplemented;
