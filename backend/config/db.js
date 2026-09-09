const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log('connected');
  })
  .catch(err => {
    console.log(err);
  });

module.exports = mongoose.connection;
