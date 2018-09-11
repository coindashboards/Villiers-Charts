// .env file stores the environment variables  
require('dotenv').config();
// TODO: do I need to connect here or somewhere else?
const mongoose = require('mongoose');
const binance = require('node-binance-api')();

const cells = require('./src/cells.js');
const utils = require('./utils/utils.js');
const debugOutput = utils.debugOutput;
const createCandle = utils.createCandle;

// TODO: check if this is necessary at all
mongoose.Promise = global.Promise;
const mongodbConnModule = require('./src/mongodbConnModule.js');
const db = mongodbConnModule.connect();

const Candle = require('./models/candleSchema');
let tokens = Object.keys(Candle.models);

const Heatmap = require('./models/heatmapSchema');

const getCandlesticks = function(tokens, p){
  binance.websockets.candlesticks(tokens, p, (candlestick) => {
    // k == ticks, x == isFinal
    let isFinal = candlestick.k.x;
    if (isFinal == true){
        let candle = createCandle(candlestick, p);
        candle.save()
        .catch((err) => console.log(err))
        .then(() => debugOutput(candlestick));
      }
  });
}

const timeframes = ['5m', '1h', '1d'];
timeframes.forEach((p) => {
  getCandlesticks(tokens, p);
});

console.log('DOGE!');