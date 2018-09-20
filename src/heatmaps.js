// TODO: add functions for computations of the cells in the row for the specific token
const constants = require('./constants');
const utils = require('../utils/utils');
const utilsHeatmaps = require('../utils/utilsHeatmaps');

// const repair = require('./repair');

const Candle = require('../models/candleSchema');
let tokens = Object.keys(Candle.models);

// take only last 'total' candles from the whole array
const filterCandles = function(entries, total = 8){
  let res = entries.sort((x, y) => {return y.time - x.time}).slice(0, total);
  return res;
}

const createLargerCandles = function(candles, token, period, candlesPerCandle){
  /**
   * open: grab the first candle open  in the set
   * close: grab the last candle close in the set
   * high: grab the highest candle high in the set
   * low: grab the highest candle high in the set
   * numTrades: grab the sum over all candles in the set
   * volume: grab the sum over all candles in the set
   * period: pass as the parameter
   */
  let largerCandles = []
  for (let i = 0; i < candles.length; i += candlesPerCandle) {
      let candlesSlice = candles.slice(i, i + candlesPerCandle);
      let largerCandle = new Candle.models[token]({
        // TODO: set the time
        // TODO: fix the number of candles that you take
        'time': utilsHeatmaps.getTime(candlesSlice),
        'open' : utilsHeatmaps.getOpen(candlesSlice),
        'close' : utilsHeatmaps.getClose(candlesSlice),
        'high' : utilsHeatmaps.getHigh(candlesSlice),
        'low' : utilsHeatmaps.getLow(candlesSlice),
        'numTrades' : utilsHeatmaps.getNumTrades(candlesSlice),
        'volume' : utilsHeatmaps.getVolume(candlesSlice),
        'period' : period
      });
      largerCandles.push(largerCandle);
  }
  return(largerCandles);
}

const processCandles = function(token, data){
    /**
     * What should happen in this function?
     * - combine 8 5m candles
     * - combine 8 1h candles
     * - combine 8 1d candles
     * - write them to the database
     */
    let candles5m = filterCandles(data, constants.NUM_5M_CANDLES);
    let candles5mFor1h = filterCandles(data, constants.NUM_1H_CANDLES);
    let candles1h = createLargerCandles(candles5mFor1h, token, '1h', constants.NUM_5M_CANDLES_PER_1H_CANDLES)
     // FIXME: create the part where you create the 1d candles
    // let candles5mFor1d = filterCandles(data, constants.NUM_1D_CANDLES);
    let candles1d = []; // createLargerCandles(candles5mFor1d, token, '1d', constants.NUM_5M_CANDLES_PER_1D_CANDLES)

    // console.log(data);
    let heatmap = utils.createHeatmap(token, candles5m, candles1h, candles1d);
    console.log(heatmap);
    return heatmap;
}

// constructs the entry for the database that will be used later on the web-page
const updateHeatmap = function(token){
    let timeframe = new Date(new Date() - constants.EXPIRATION_TIME_SECONDS);
    console.log(token, timeframe);

    let params = {
      'time' : { $lte: timeframe }, // FIXME: $gte
      'period' : '5m'
    };

    Candle.models[token].find(
      params // FIXME: $gte
    ).sort({time: 'descending'}).exec().then((res) => {
        // TODO: check that data is alright
        // contains all necessary candles
        let heatmap = processCandles(token, res);
        // heatmap.save();
    })
    // .catch((err) => {
    //     console.log(token, 'triggered error');
    // });
}

tokens.forEach(token => {
    // console.log(token);
    // updateHeatmap(token);
    // setInterval(updateHeatmap, constants.UPDATE_TIME_INTERVAL, token);
})

updateHeatmap('ADABTC');

module.exports = {
  filterCandles
}