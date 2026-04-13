const express = require('express');
const problemRouter = require('./problems.routes');
const aiProblemRouter = require('../../ai-question-generator/routes/aiProblemRoutes');

const v1Router = express.Router();
v1Router.use('/problems', problemRouter);
v1Router.use('/ai', aiProblemRouter);

module.exports = v1Router;
