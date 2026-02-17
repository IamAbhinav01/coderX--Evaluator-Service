const { StatusCodes } = require('http-status-codes');
const notImplemented = require('../errors/NotImplemented.err');
function addProblem(req, res, next) {
  try {
    throw new notImplemented();
  } catch (err) {
    console.log(err);
  }
}

function getProblem(req, res) {
  return res.status(StatusCodes.NOT_IMPLEMENTED).json({
    message: 'Not Implemented',
  });
}
function getProblems(req, res) {
  return res.status(StatusCodes.NOT_IMPLEMENTED).json({
    message: 'Not Implemented',
  });
}
function deleteProblem(req, res) {
  return res.status(StatusCodes.NOT_IMPLEMENTED).json({
    message: 'Not Implemented',
  });
}
function updateProblem(req, res) {
  return res.status(StatusCodes.NOT_IMPLEMENTED).json({
    message: 'Not Implemented',
  });
}
module.exports = {
  addProblem,
  getProblem,
  getProblems,
  deleteProblem,
  updateProblem,
};
