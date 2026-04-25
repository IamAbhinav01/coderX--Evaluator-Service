<<<<<<< HEAD
import express from 'express';
import { pingCheck } from '../../controllers/ping.controller';
import submissionRouter from './submission.Route';
const V1Router = express.Router();

V1Router.get('/ping-check', pingCheck);
V1Router.use('/submissions', submissionRouter);

export default V1Router;
=======
import express from "express";

import { pingCheck } from "../../controllers/pingController";
import submissionRouter from "./submissionRoutes";

const v1Router = express.Router();

v1Router.use('/submissions', submissionRouter);


v1Router.get('/ping', pingCheck);

export default v1Router;
>>>>>>> d1fbfe487c3f29080ac92320aefdcae0e43cda95
