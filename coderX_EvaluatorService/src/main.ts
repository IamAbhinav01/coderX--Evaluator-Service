import express from 'express';
import serverConfig from './config/server.config';
import apiRouter from './routes';

import serverAdapter from './config/BullBoard.config';

import sampleQueueProducers from './producers/sampleQueueProducers';
import SampleWorker from './workers/sampleWorker';
import runPython from './containers/runPythonDocker';
import runCpp from './containers/runCppDocker';

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
  #include<iostream>
  using namespace std;
  int main()
  {
      int a;
      cin>>a;
      cout<<"Hello World"<<a<<endl;
      for(int i = 0;i<10;i++)
      {
        cout<<i<<" ";
      }
  }
  `;
  const inputCase = `20`;
  runCpp(code, inputCase);
  // add job
  // await sampleQueueProducers('paymentQueue', {
  //   name: 'Abhinav Sunil',
  //   place: 'Jalndhar',
  //   college: 'LPU',
  //   program: 'Btech CSE Artificial INtelligence and Machine Learning',
  // });
});
