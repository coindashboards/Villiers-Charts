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
  period: {type: String}
});

const models = {};
// sync read 
fs.readFileSync(process.env.BTC_MARKETS_FILE).toString().split('\n').forEach((ticker) => { 
    models[ticker] = mongoose.model(ticker, candleSchema, ticker); // second ticker: name of the collection 
})

module.exports = {
  models
}