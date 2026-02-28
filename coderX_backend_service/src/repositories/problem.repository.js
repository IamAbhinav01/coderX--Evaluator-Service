const { Problem } = require('../models');
const { NotFoundError } = require('../errors/NotFound.err');
const logger = require('../config/logger.config');
class ProblemRepository {
  async createProblem(problemData) {
    try {
      const problem = await Problem.create({
        title: problemData.title,
        description: problemData.description,
        testCases: problemData.testCases ? problemData.testCases : [],
      });
      return problem;
    } catch (err) {
      console.log('Error in creating problem', err);
      throw new NotFoundError('Error in creating problem');
    }
  }
  async getProblem(problemId) {
    try {
      const problem = await Problem.findById(problemId);
      return problem;
    } catch (err) {
      throw new NotFoundError('Problem not found');
    }
  }
  async getProblems() {
    try {
      const problems = await Problem.find({});
      return problems;
    } catch (err) {
      throw new NotFoundError('Problems not found');
    }
  }
  async deleteProblem(problemId) {
    try {
      const deletedProblem = await Problem.findByIdAndDelete(problemId);
      if (!deletedProblem) {
        logger.error(`Problem with id ${problemId} not found for deletion`);
        throw new NotFoundError('Problem not found');
      }
    } catch (err) {
      throw new NotFoundError('Problem not found');
    }
  }
  async updateProblem(problemId, problemData) {
    try {
      const problem = await Problem.findByIdAndUpdate(problemId, problemData, {
        new: true,
      });
      return problem;
    } catch (err) {
      throw new NotFoundError('Problem not found');
    }
  }
}
module.exports = ProblemRepository;
