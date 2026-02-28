const statusCodes = require('http-status-codes');
const BaseError = require('./Base.err');
const { StatusCodes } = require('status-codes');
class BadRequest extends BaseError {
  constructor(methodName) {
    super('Bad Request', statusCodes.BadRequest, {});
  }
}
module.exports = BadRequest;
