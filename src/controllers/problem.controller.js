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
async function getProblems(req, res) {
  try {
    const problems = await problemService.getProblems();
    return res.status(StatusCodes.OK).json({
      Success: true,
      Message: 'Problems fetched successfully',
      data: problems,
    });
  } catch (err) {
    next(err);
  }
}
async function deleteProblem(req, res) {
  try {
    await problemService.deleteProblem(req.params.id);
    return res.status(StatusCodes.OK).json({
      Success: true,
      Message: 'Problem deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}
function updateProblem(req, res) {
  try {
    const updatedProblem = problemService.updateProblem(
      req.params.id,
      req.body
    );
    return res.status(StatusCodes.OK).json({
      Success: true,
      Message: 'Problem updated successfully',
      data: updatedProblem,
    });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  pingProblemChecker,
  addProblem,
  getProblem,
  getProblems,
  deleteProblem,
  updateProblem,
};
