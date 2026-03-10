import express from 'express';
import serverConfig from './config/server.config';
import apiRouter from './routes';

import serverAdapter from './config/BullBoard.config';

import sampleQueueProducers from './producers/sampleQueueProducers';
import SampleWorker from './workers/sampleWorker';
import runPython from './containers/runPythonDocker';

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

  const code = `a = input()
print("hello World!",a)
for i in range(20):
  print(i)`;
  const inputCase = `20`;
  runPython(code, inputCase);
  // add job
  // await sampleQueueProducers('paymentQueue', {
  //   name: 'Abhinav Sunil',
  //   place: 'Jalndhar',
  //   college: 'LPU',
  //   program: 'Btech CSE Artificial INtelligence and Machine Learning',
  // });
});
