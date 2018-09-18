// this script is mainly for test purposes
// will be extended later on for full set of tests

var expect = require('chai').expect;

const binance = require('node-binance-api')();
const Candle = require('../models/candleSchema');
const constants = require('../src/constants');
const utils = require('./../utils/utils');
const repair = require('./../src/repair');

const createCandleFromAPI = utils.createCandleFromAPI;
const debugOutputFromAPI = utils.debugOutputFromAPI;
const getDeltaTime = repair.getDeltaTime;
const getFromTo = repair.getFromTo;

// TODO: finish the test; add candle data
// describe('testGetDeltaTime', () => {
//   it('should return delta time between 2 consequitive candles', () => {
//     // 1. arrange
//     let expectedDelta = 0;
//     // 2. act
//     let gotDelta = getDeltaTime();
//     // 3. assert
//     expect(gotDelta).to.be.equal(expectedDeltaT);
//   });
// });

// DONE:
// TODO: finish this one; add proper dates and tests
// describe('getFromTo', () => {
//   it('should return time from one candle to another (padded by a bit)', () => {
//     // 1. arrange
//     let fromCandleTime = new Date();
//     let toCandleTime = new Date();
//     let deltaTime = 5000;
//     // 2. act
//     let from = new Date(fromCandleTime.getTime() + constants.TIME_30_SECONDS).getTime();
//     let to = new Date(toCandleTime.getTime() - constants.TIME_30_SECONDS).getTime();
//     // 3. assert
//     expect(to - from).atLeast(1);
//     expect(to - from).below(deltaTime);
//   });
// });





// test all traiding pairs for missing candles
// const testAllTokensCandlesConsecutive = function(){
//   let tokens = Object.keys(Candle.models);
//   tokens.forEach(token => {
//     testTokenCandlesConsecutive(token);
//   });
// }