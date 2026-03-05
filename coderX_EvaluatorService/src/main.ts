import express from 'express';
import serverConfig from './config/server.config';
import apiRouter from './routes';

import serverAdapter from './config/BullBoard.config';

import sampleQueueProducers from './producers/sampleQueueProducers';
import SampleWorker from './workers/sampleWorker';

const PORT = serverConfig.PORT;

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

app.use('/api', apiRouter);

app.use('/admin/queues', serverAdapter.getRouter());
app.listen(serverConfig.PORT, async () => {
  console.log(`Server started at ${serverConfig.PORT}`);

  // start worker
  SampleWorker('paymentQueue');

  // add job
  await sampleQueueProducers('paymentQueue', {
    name: 'Abhinav Sunil',
    place: 'Jalndhar',
    college: 'LPU',
    program: 'Btech CSE Artificial INtelligence and Machine Learning',
  });
});
