const mongoose = require('mongoose');
// schema is used to write the data to the database
const Schema = mongoose.Schema;

const candleSchema = new Schema({
  time: {type: Date},
  open: {type: Number},
  close: {type: Number},
  high: {type: Number},
  low: {type: Number},
  numTrades: {type: Number},
  volume: {type: Number}
});

const Candle = mongoose.model('Candle', candleSchema);
module.exports = Candle;
