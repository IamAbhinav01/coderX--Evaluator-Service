<<<<<<< HEAD
import express from 'express';
import V1Router from './v1';

const apiRouter = express.Router();

apiRouter.use('/v1', V1Router);
export default apiRouter;
=======
import express from "express";

import v1Router from "./v1";

const apiRouter = express.Router();

apiRouter.use('/v1', v1Router);

export default apiRouter;
>>>>>>> d1fbfe487c3f29080ac92320aefdcae0e43cda95
