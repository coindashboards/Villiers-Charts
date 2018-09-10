// .env file stores the environment variables  
require('dotenv').config();
// TODO: do I need to connect here or somewhere else?
const mongoose = require('mongoose');
const binance = require('node-binance-api')();

const utils = require('./utils/utils.js');
const debugOutput = utils.debugOutput;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, poolSize: 50}, (err) => {
  if (err)
    console.log(err);
  else 
    console.log('Connected to MongoDB')
});

const Candle = require('./models/candleSchema');
let tokens = Object.keys(Candle.models);

binance.websockets.candlesticks(tokens, "1m", (candlesticks) => {
  let { e:eventType, E:eventTime, s:pSymbol, k:pTicks } = candlesticks;
  let { o:pOpen, h:pHigh, l:pLow, c:pClose, v:pVolume, n:pTrades, i:pInterval, x:pIsFinal, q:pQuoteVolume, V:pBuyVolume, Q:pQuoteBuyVolume } = pTicks;
  if (pIsFinal == true){
    // saving part
    let candle = new Candle.models[pSymbol]({
      // time: {type: Date},
      open: pOpen,
      close: pClose,
      high: pHigh,
      low: pLow,
      numTrades: pTrades,
      volume: pVolume
    });

    candle.save((err) => {
      if (err) {
        // TODO: propagate error handling
        console.log('Error:(');
      }
      else{
        // console.log('DOGE!');
      }
    });

    debugOutput(candlesticks);
  }
});

console.log('DOGE!');
