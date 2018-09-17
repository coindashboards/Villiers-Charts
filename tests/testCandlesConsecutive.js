// this script is mainly for test purposes
// will be extended later on for full set of tests
const Candle = require('../models/candleSchema');
const constants = require('../src/constants');
const utils = require('./../utils/utils');
const createCandle = utils.createCandle;

const getDeltaTime =  function (candles, idx) {
  // websockets, sometimes, reply with the delay + there might be difference in milliseconds
  // that's why we drop thm before the comparison good delta_t is 60 000
  return candles[idx].time.setSeconds(0, 0) - candles[idx + 1].time.setSeconds(0,0);
}

// TODO: stress test this one
const getFromTo = function(fromCandleTime, toCandleTime){
  let from = new Date(fromCandleTime.getTime() + constants.TIME_30_SECONDS);
  let to = new Date(toCandleTime.getTime() - constants.TIME_30_SECONDS);
  return {'from': from, 'to': to};
}

const copyCandles = function(candlesticks){
  let newCandles = [];
  candlesticks.forEach(candlestick => {
    let candle = createCandle(candlestick);
    newCandles.push(candle);
    // DEBUG: only
    debugOutput(candlestick);
  });
  return newCandles;
}

// TODO: move this to repair.js
// TODO: rewrite with catch .. then
const getCandlesFromTo = function(token, period = '5m', fromCandleTime, toCandleTime){
  // we pad the candles with +/-30 secs to be sure that we capture everything
  let timeBoundaries = getFromTo(fromCandleTime, toCandleTime);

  console.log(timeBoundaries);

  let missingCandles = [];
  binance.candlesticks(token, period, (error, candlesticks, symbol) => {
    if (error) console.log(error);
    // missingCandles = copyCandles(candlesticks);
  }, {startTime: timeBoundaries.from, endTime: timeBoundaries.to});
  return missingCandles;
}

const getMissingCandles = function(token, candles, period){
  let isOk = true;
  // first accumulate after that putt them in the database
  let allMissingCandles = [];
  for (let j = 0; j < candles.length - 1; j++){
      let dT = getDeltaTime(candles, j);
      if (dT != period){
          // TODO: add some self repairing mechanism
          isOk = false;
          console.log('%s : %s -> %s', token, candles[j].time, candles[j + 1].time);
          let missingCandles = getCandlesFromTo(token, period, candles[j + 1].time, candles[j].time);
          // // HACK: or should ot be that way?
          // allMissingCandles = allMissingCandles.concat(missingCandles);
          // // TODO: write the missing candle to the database

      }
  }
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
const testTokenCandlesConsecutive = function(token){
  let timeframe = new Date(new Date() - constants.EXPIRATION_TIME_SECONDS);
  Candle.models[token].find({
      'time': { $gte: timeframe }, 'period' : '5m'
  }).sort({time: 'descending'}).exec().then((data) => {
      // contains all necessary candles

      let allMissingCandles = [];
      allMissingCandles = getMissingCandles(token, data, 60000); // constants.DELTA_TIME_BETWEEN_CANDLES);
      // TODO: Uncomment once done
      //saveCandlesToDatabase(allMissingCandles);
  }).catch((err) => {
      console.log(token, 'triggered error');
  });
}

testTokenCandlesConsecutive('ADABTC');

// test all traiding pairs for missing candles
// const testAllTokensCandlesConsecutive = function(){
//   let tokens = Object.keys(Candle.models);
//   tokens.forEach(token => {
//     testTokenCandlesConsecutive(token);
//   });
// }

// const testAllCandlesPresented = function (){
//     // 1. test that all candels are really consequitive and none of the are missing
//     let tokens = Object.keys(Candle.models);
//     tokens.forEach(token => {
//         Candle.models[token].find({"time": {$gte: new Date(2018, 8, 6)}}).sort({date: 'ascending'}).exec((err, res) => {
//             if (err){
//                 console.log(err);
//                 return;
//             }
//             let isOk = true;
//             let n = res.length;
//             for (let j = 0; j < n - 1; j++){
//                 // websockets, sometimes, reply with the delay
//                 // + there might be difference in milliseconds
//                 // that's why we drop thm before the comparison
//                 // good delta_t is 60 000
//                 let dT =  res[j + 1].time.setSeconds(0,0) - res[j].time.setSeconds(0,0);
//                 if (dT != constants.DELTA_TIME_BETWEEN_CANDLES){
//                     // TODO: add some self repairing mechanism
//                     console.log('%s : %s -> %s', token, res[j].time, res[j + 1].time);
//                     isOk = false;
//                 }
//                 // TODO:
//                 // [ ] take the candle date
//                 // [ ] take the next candle date
//                 // [ ] query the missing data FIXME: remember that  you might hit the query limit

//             }
//         });
//     });
// }