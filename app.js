// .env file stores the environment variables
require('dotenv').config();

const mongoose = require('mongoose');
// TODO: check if this is necessary at all
mongoose.Promise = global.Promise;
const mongodbConnenctionModule = require('./src/database');
mongodbConnenctionModule.connect();

// grab the candlesticks from binance
require('./src/candlesticks');

// create the heatmaps
// require('./src/heatmaps');

// fix the missing candlesticks
// require(...);

console.log('app started!');