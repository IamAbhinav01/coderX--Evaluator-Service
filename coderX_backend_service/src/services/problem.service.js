const markdownToHtml = require('../utils/markdownSanitiser');
class ProblemService {
  constructor(problemRepository) {
    this.problemRepository = problemRepository;
  }
  async createProblem(problemData) {
    try {
      problemData.description = markdownToHtml(problemData.description);

      console.log('problem data', problemData);

      const problem = await this.problemRepository.createProblem(problemData);

      return problem;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getProblem(problemId) {
    try {
      const problem = await this.problemRepository.getProblem(problemId);
      return problem;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async deleteProblem(problemId) {
    try {
      await this.problemRepository.deleteProblem(problemId);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getProblems() {
    try {
      const problems = await this.problemRepository.getProblems();
      return problems;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async updateProblem(problemId, problemData) {
    try {
      const updatedProblem = await this.problemRepository.updateProblem(
        problemId,
        problemData
      );
      return updatedProblem;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
module.exports = ProblemService;
