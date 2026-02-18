const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes');
const errorHandler = require('./utils/ErrorHandler');
const connectToDB = require('./config/db.config');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use('/api', apiRouter);
app.use(errorHandler);
app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  await connectToDB();
  console.log('Successfully connected to db');
});
