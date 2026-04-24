import express from 'express';
import serverConfig from './config/server.config';
import apiRouter from './routes';

import serverAdapter from './config/BullBoard.config';

import SubmissionWorker from './workers/submission.worker';

const PORT = serverConfig.PORT;

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

app.use('/admin/queues', serverAdapter.getRouter());
app.listen(serverConfig.PORT, async () => {
  console.log(`Server started at ${serverConfig.PORT}`);

  // Start the worker to consume jobs from SubmissionQueue
  SubmissionWorker('SubmissionQueue');
});
