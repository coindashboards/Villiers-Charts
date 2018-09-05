require('dotenv').config();
const fs = require('fs');

const mongoose = require('mongoose');
// schema is used to write the data to the database
const Schema = mongoose.Schema;

const candleSchema = new Schema({
  time: {type : Date, default: Date.now},
  open: {type: Number},
  close: {type: Number},
  high: {type: Number},
  low: {type: Number},
  numTrades: {type: Number},
  volume: {type: Number},
});

// TODO: check if this is actually the best way to write the same
// datastructure to different collections 
// TODO: maybe it makes sense to have some time of dictionary here? 
// btc -> model1, poa -> model2, ont -> model3 
// const btcCandle = mongoose.model('btcCandle', candleSchema);
// const poaCandle = mongoose.model('poaCandle', candleSchema);
// const ontCandle = mongoose.model('ontCandle', candleSchema);

// module.exports = {
//   btcCandle, 
//   poaCandle, 
//   ontCandle
// };

// read the file btc-market-tickers.txt 
// and create the corresponding models 
const models = {};
// sync read 
fs.readFileSync(process.env.BTC_MARKETS_FILE).toString().split('\n').forEach((ticker) => { 
    console.log(ticker); 
    // dict[line] = 'model' + (idx++);
    models[ticker] = mongoose.model(ticker, candleSchema);
})
console.log(models);

// general construct should look like 
// const ontCandle = mongoose.model(model1, candleSchema);
// models['ETHBTC'] = mongoose.model('ETHBTC', candleSchema);

module.exports = {
  models
}