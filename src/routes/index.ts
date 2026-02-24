import express from 'express';
import V1Router from './v1';

const apiRouter = express.Router();

apiRouter.use('/v1', V1Router);
export default apiRouter;
