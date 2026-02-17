const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use('/api', apiRouter);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
