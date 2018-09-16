// this script is mainly for test purposes
// will be extended later on for full set of tests
const Candle = require('../models/candleSchema');
const constants = require('../src/constants');

const getDeltaTime =  function (candles, idx) {
  // websockets, sometimes, reply with the delay + there might be difference in milliseconds
  // that's why we drop thm before the comparison good delta_t is 60 000
  return candles[idx].time.setSeconds(0, 0) - candles[idx + 1].time.setSeconds(0,0);
}

// TODO: move this to repair.js
const getCandlesFromTo = function(fromCandle, toCandle){
  // we pad the candles with +/-30 secs to be sure that we capture everything

}

const getMissingCandles = function(token, candles, period){
  let isOk = true;
  let n = candles.length;
  for (let j = 0; j < n - 1; j++){
      let dT = getDeltaTime(candles, idx);
      if (dT != period){
          // TODO: add some self repairing mechanism
          console.log('%s : %s -> %s', token, candles[j].time, candles[j + 1].time);
          isOk = false;
      }
  }
}

// this one tests that candles in the database are fine
const testTokenCandlesConsecutive = function(token){
  let timeframe = new Date(new Date() - constants.EXPIRATION_TIME_SECONDS);
  Candle.models[token].find({
      'time': { $gte: timeframe }, 'period' : '1m'
  }).sort({time: 'descending'}).exec().then((data) => {
      // contains all necessary candles

      let missingCandles = [];
      getMissingCandles(token, data, 60000); // constants.DELTA_TIME_BETWEEN_CANDLES);

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