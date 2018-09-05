// .env file stores the environment variables  
require('dotenv').config();
// TODO: do I need to connect here or somewhere else?
const mongoose = require('mongoose');
const binance = require('node-binance-api')();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true}, (err) => {
  if (err)
    console.log(err);
  else 
    console.log('Connected to MongoDB')
});

const Candle = require('./candleSchema');
let tokens = Object.keys(Candle.models);

binance.websockets.candlesticks(tokens, "1m", (candlesticks) => {
  let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
  let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
  if (isFinal == true){
    console.log(symbol+" "+interval+" candlestick update");
    console.log("open: "+open);
    console.log("high: "+high);
    console.log("low: "+low);
    console.log("close: "+close);
    console.log("volume: "+volume);
    console.log("isFinal: "+isFinal);
  }
});


// saving part
// let candle = new Candle.models['POABTC']({
//   // time: {type: Date},
//   open: 42,
//   close: 42,
//   high: 42,
//   low: 8,
//   numTrades: 11,
//   volume: 34.5
// });
// candle.save((err) => {
//   if (err) 
//     console.log('Error:(');
//   else
//     console.log('DOGE!');
// });

console.log('DOGE!');
