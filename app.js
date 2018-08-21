// .env file stores the environment variables  
require('dotenv').config();
// TODO: do I need to connect here or somewhere else?
const mongoose = require('mongoose');
const binance = require('node-binance-api')();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, (err) => {
  if (err)
    console.log(err);
  else 
    console.log('Connected to MongoDB')
});

const Candle = require('./candleSchema');

binance.prices((error, tickers) => {
  if (!error)
    console.log(tickers);
  else 
    console.log(error);
})


console.log('doge!');
