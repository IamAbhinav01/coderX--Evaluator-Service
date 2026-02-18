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
}
module.exports = ProblemRepository;
