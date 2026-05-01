import express from 'express';
import { pingCheck } from '../../controllers/ping.controller';
import submissionRouter from './submission.Route';
const V1Router = express.Router();

V1Router.get('/ping-check', pingCheck);
V1Router.use('/submissions', submissionRouter);

export default V1Router;
