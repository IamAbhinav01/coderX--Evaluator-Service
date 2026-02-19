const { StatusCodes } = require('http-status-codes');
const notImplemented = require('../errors/NotImplemented.err');

const { ProblemRepository } = require('../repositories');
const { ProblemService } = require('../services');

const problemService = new ProblemService(new ProblemRepository());
async function addProblem(req, res, next) {
  try {
    console.log('incomming reqbody', req.body);

    const newproblem = await problemService.createProblem(req.body);
    return res.status(StatusCodes.CREATED).json({
      Success: true,
      Message: 'Problem created successfully',
      error: {},
      data: newproblem,
    });
  } catch (err) {
    next(err);
  }
}

function pingProblemChecker(req, res) {
  return res.json({ message: 'Ping controller is up' });
}

async function getProblem(req, res) {
  try {
    const problem = await problemService.getProblem(req.params.id);
    return res.status(StatusCodes.OK).json({
      Success: true,
      Message: 'Problem fetched successfully',
      data: problem,
    });
  } catch (err) {
    next(err);
  }
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
  pingProblemChecker,
  addProblem,
  getProblem,
  getProblems,
  deleteProblem,
  updateProblem,
};
