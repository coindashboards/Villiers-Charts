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

let tokens = new Map([ ["POA", Candle.poaCandle], ["ONT", Candle.ontCandle]]);

tokens.forEach((model, t) => {
  // TODO: BTC market is ETHBTC not BTCETH
  binance.candlesticks(t + "ETH", "5m", (error, ticks, symbol) => {
    if (error) 
      console.log("Oups!");
    console.log("candlesticks()", ticks);
    let last_tick = ticks[ticks.length - 1];
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
    console.log(symbol + " last close: " + close);
  }, {limit: 3});
});

// let candle = new Candle.btcCandle({
//   // time: {type: Date},
//   open: 12,
//   close: 15,
//   high: 25,
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
