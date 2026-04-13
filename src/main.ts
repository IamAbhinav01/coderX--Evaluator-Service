import express from 'express';
import serverConfig from './config/server.config';
import apiRouter from './routes';

import serverAdapter from './config/BullBoard.config';

import sampleQueueProducers from './producers/sampleQueueProducers';
import SampleWorker from './workers/sampleWorker';
import execute from './containers/pythonExecutor';
import runCpp from './containers/cppExecutor';
import runJava from './containers/javaExecutor';

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
  const code = `
a = input()
print("hello world,a)
`;

  const inputCase = `20`;
  // execute(code, inputCase);
  // add job
  // await sampleQueueProducers('paymentQueue', {
  //   name: 'Abhinav Sunil',
  //   place: 'Jalndhar',
  //   college: 'LPU',
  //   program: 'Btech CSE Artificial INtelligence and Machine Learning',
  // });
});
