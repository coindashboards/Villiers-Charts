const binance = require('node-binance-api')();
const utils = require('./../utils/utils');
const debugOutput = utils.debugOutput;
const createCandle = utils.createCandle;

const Candle = require('./../models/candleSchema');
let tokens = Object.keys(Candle.models);

const getCandlesticks = function(tokens, p){
  binance.websockets.candlesticks(tokens, p, (candlestick) => {
    // k == ticks, x == isFinal
    let isFinal = candlestick.k.x;
    if (isFinal){
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