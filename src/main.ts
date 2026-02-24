import express from 'express';
import serverConfig from './config/server.config';
import apiRouter from './routes';

const PORT = serverConfig.PORT;

const app = express();

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
