const mongoose = require('mongoose');
const { ATLAS_DB_URL, NODE_ENV } = require('./server.config');
async function connectToDB() {
  try {
    if (NODE_ENV === 'development') {
      await mongoose.connect(ATLAS_DB_URL);
    }
    console.log('Connected to MongoDB atlas');
  } catch (err) {
    console.log('unable to connect to mongoDB');
    console.log(err);
  }
}
module.exports = connectToDB;
