// checks that all candlesticks are in place
// and that none of those should be fixed

// TODO: add functions for computations of the cells in the row for the specific token
const constants = require('./constants');
const utils = require('../utils/utils');

const binance = require('node-binance-api')();

const debugOutput = utils.debugOutput;
const createCandle = utils.createCandle;

const Candle = require('../models/candleSchema');
let tokens = Object.keys(Candle.models);

const timeframes = ['5m', '1h', '1d'];

/**
 * What is the logic behind the fixing mechanism?
 * - try to find all necessary candles
 * - if any missing grab them as fallback mech
 * - put them in the table
 * - grab candles again, everything should be there
 */

const getDeltaTime =  function (candles, idx) {
  // websockets, sometimes, reply with the delay + there might be difference in milliseconds
  // that's why we drop thm before the comparison good delta_t is 60 000
  return candles[idx].time.setSeconds(0, 0) - candles[idx + 1].time.setSeconds(0,0);
}

const getFromTo = function(fromCandleTime, toCandleTime){
  // .getTime() returns the unix time format
  let from = new Date(fromCandleTime.getTime() + constants.TIME_30_SECONDS).getTime();
  let to = new Date(toCandleTime.getTime() - constants.TIME_30_SECONDS).getTime();
  return {'from': from, 'to': to};
}

const copyCandles = function(candlesticks, token, period){
  let newCandles = [];
  candlesticks.forEach(candlestick => {
      let candle = createCandleFromAPI(candlestick, token, period);
      newCandles.push(candle);
      // DEBUG: only
      debugOutputFromAPI(candlestick, token, period);
  });
  return newCandles;
}

// TODO: move this to repair.js
// TODO: rewrite with catch .. then
const getCandlesFromTo = function(token, period = '5m', fromCandleTime, toCandleTime){
  // we pad the candles with +/-30 secs to be sure that we capture everything
  let timeBoundaries = getFromTo(fromCandleTime, toCandleTime);
  // DEBUG:
  // console.log(token, period );
  let missingCandles = [];
  binance.candlesticks(token, period, (error, candlesticks, symbol) => {
    if (error) console.log(error);
    // DEBUG:
    // console.log(candlesticks);
    missingCandles = copyCandles(candlesticks, token, period);
  }, {startTime: timeBoundaries.from, endTime: timeBoundaries.to});

  return missingCandles;
}

const getMissingCandles = function(token, candles, period, expectedDeltaT){
  let isOk = true;
  // first accumulate after that putt them in the database
  let allMissingCandles = [];
  for (let j = 0; j < candles.length - 1; j++){
      let dT = getDeltaTime(candles, j);
      if (dT != expectedDeltaT){
          // TODO: add some self repairing mechanism
          isOk = false;
          console.log('%s : %s -> %s', token, candles[j].time, candles[j + 1].time);
          let missingCandles = getCandlesFromTo(token, period, candles[j + 1].time, candles[j].time);
          // HACK: or should ot be that way?
          allMissingCandles = allMissingCandles.concat(missingCandles);
      }
  }

  console.log(allMissingCandles);

  return allMissingCandles;
}

const saveCandlesToDatabase = function(candles){
  candles.forEach(candle => {
    candle.save()
      .catch((err) => console.log(err))
      .then(() => debugOutput(candlestick));
  });
}

// this one tests that candles in the database are fine
const testTokenCandlesConsecutive = function(token, period){
  let timeframe = new Date(new Date() - constants.EXPIRATION_TIME_SECONDS);
  let params = { 'time': { $gte: timeframe }, 'period' : period };
  Candle.models[token].find(params).sort({time: 'descending'}).exec().then((data) => {
      // contains all necessary candles
      let allMissingCandles = [];
      allMissingCandles = getMissingCandles(token, data, '1m', 60000); // constants.DELTA_TIME_BETWEEN_CANDLES);
      // TODO: Uncomment once done
      //saveCandlesToDatabase(allMissingCandles);
  }).catch((err) => {
      console.log(token, 'triggered error');
  });
}

testTokenCandlesConsecutive('ADABTC', '5m');

module.exports = {
  getDeltaTime,
  getFromTo
}