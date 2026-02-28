const { problemController } = require('../../controllers');
const express = require('express');
const problemRouter = express.Router();

// problemRouter.get('/ping', problemController.pingProblemChecker);
problemRouter.get('/', problemController.getProblems);
problemRouter.get('/:id', problemController.getProblem);
problemRouter.post('/', problemController.addProblem);
problemRouter.delete('/:id', problemController.deleteProblem);
problemRouter.put('/:id', problemController.updateProblem);

module.exports = problemRouter;
