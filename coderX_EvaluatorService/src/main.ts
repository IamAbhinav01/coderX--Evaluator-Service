import express from 'express';
import serverConfig from './config/server.config';
import apiRouter from './routes';

import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { SampleQueue } from './queues/sampleQueue';
import { emailQueue, paymentQueue } from './queues/sampleQueue';

import sampleQueueProducers from './producers/sampleQueueProducers';
import SampleWorker from './workers/sampleWorker';

const PORT = serverConfig.PORT;

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

app.use('/api', apiRouter);
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(SampleQueue),
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(paymentQueue),
  ],
  serverAdapter,
});
app.use('/admin/queues', serverAdapter.getRouter());
app.listen(serverConfig.PORT, async () => {
  console.log(`Server started at ${serverConfig.PORT}`);

  // start worker
  SampleWorker('sample-Queue');

  // add job
  await sampleQueueProducers('emailQueue', {
    name: 'Abhinav',
    place: 'Kerala',
    college: 'LPU',
    program: 'Artificial INtelligence and Machine Learning',
  });
});
