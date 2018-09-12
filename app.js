// .env file stores the environment variables  
require('dotenv').config();
// TODO: do I need to connect here or somewhere else?
const mongoose = require('mongoose');

// TODO: check if this is necessary at all
mongoose.Promise = global.Promise;
const mongodbConnModule = require('./src/database');
mongodbConnModule.connect();

// grab the candlesticks from binance
require('./src/candlesticks');

// create the heatmaps 
// require('./src/heatmaps');

console.log('app started!');