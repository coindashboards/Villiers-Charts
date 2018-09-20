const binance = require('node-binance-api')();
const utils = require('./../utils/utils');
// const debugOutput = utils.debugOutput;
const createCandle = utils.createCandle;

const Candle = require('./../models/candleSchema');
let tokens = Object.keys(Candle.models);

binance.websockets.candlesticks(tokens, '5m', (candlestick) => {
  // k == ticks, x == isFinal
  let isFinal = candlestick.k.x;
  if (isFinal){
      let candle = createCandle(candlestick);
      candle.save()
      .catch((err) => console.log(err))
      .then(() => {
        // debugOutput(candlestick);
      });
    }
});