const { Problem } = require('../models');
const { NotFoundError } = require('../errors/NotFound.err');
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
      await Problem.deleteOne({
        _id: problemId,
      });
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
