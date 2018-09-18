// this script is mainly for test purposes
// will be extended later on for full set of tests
var expect = require('chai').expect;
var assert = require('chai').assert;

const Candle = require('../models/candleSchema');
const constants = require('../src/constants');
const repair = require('./../src/repair');

const getDeltaTime = repair.getDeltaTime;
const getFromTo = repair.getFromTo;

describe('testGetDeltaTime', () => {
  it('should return delta time between 2 consequitive candles', () => {
    // 1. arrange
    let ticker = 'ADABTC';
    let candle1 = new Candle.models[ticker]({
      time: new Date('September 18, 2018 09:35:00 212'),
      open: 0.00001003, close: 0.00001003,
      high: 0.00001004, low: 0.00001001,
      numTrades: 1234, volume: 173110,
      period: '5m'
    });
    let candle2 = new Candle.models[ticker]({
      time: new Date('September 18, 2018 09:40:02 018'),
      open: 0.00001006, close: 0.00001008,
      high: 0.00001008, low: 0.00001006,
      numTrades: 1432, volume: 4908,
      period: '5m'
    });
    let candle3 = new Candle.models[ticker]({
      time: new Date('September 18, 2018 09:45:04 018'),
      open: 0.00001007, close: 0.00001006,
      high: 0.00001008, low: 0.00001006,
      numTrades: 2314, volume: 61258,
      period: '5m'
    });

    let candles = [candle3, candle2, candle1];
    let idx = [0, 1];
    let gotDelta = [];
    // 2. act
    gotDelta.push(Math.abs(getDeltaTime(candles, idx[0])));
    gotDelta.push(Math.abs(getDeltaTime(candles, idx[1])));
    // 3. assert
    expect(gotDelta[0]).to.be.equal(constants.DELTA_TIME_BETWEEN_CANDLES);
    expect(gotDelta[1]).to.be.equal(constants.DELTA_TIME_BETWEEN_CANDLES);
  });
});

describe('testGetFromTo', () => {
  it('should return time from one candle to another (padded by a bit)', () => {
    // 1. arrange
    let fromCandleTime = new Date('September 18, 2018 07:30:00');
    let toCandleTime = new Date('September 18, 2018 07:35:00');
    // 2. act
    let res = getFromTo(fromCandleTime, toCandleTime)
    // 3. assert
    assert.isAtLeast(res.to - res.from, constants.TIME_1_MINUTE);
    assert.isBelow(res.to - res.from, constants.DELTA_TIME_BETWEEN_CANDLES);
  });
});




