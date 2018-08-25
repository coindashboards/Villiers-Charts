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
const btcCandle = mongoose.model('btcCandle', candleSchema);
const poaCandle = mongoose.model('poaCandle', candleSchema);
const ontCandle = mongoose.model('ontCandle', candleSchema);

module.exports = {
  btcCandle, 
  poaCandle, 
  ontCandle
};
