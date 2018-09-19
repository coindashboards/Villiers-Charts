const expect = require('chai').expect;
const assert = require('chai').assert;
const heatmaps = require('../src/heatmaps');
const constants = require('../src/constants');
const Candle = require('../models/candleSchema');

const mongoose = require('mongoose');
const mongodbConnenctionModule = require('../src/database');

describe('filterCandles()', () => {
  before('connect', () => {
    return mongodbConnenctionModule.connect();
  });

  it('should pick \'total\' candles with the specific \'period\' and return them sorted in descending order', () => {
    let token = 'ADABTC';
    let period = '5m';

    let numCandles = [constants.NUM_5M_CANDLES, constants.NUM_1H_CANDLES, constants.NUM_1D_CANDLES];
    Candle.models[token].find().sort({time: 'descending'}).exec().then((res) => {
      numCandles.forEach((total) => {
        let candles = heatmaps.filterCandles(res, period, total);
        expect(candles.length).to.be.equal(total);
      });
    }).catch((err) => {
      // TODO: how to hadle this case?
      console.log(token, 'triggered error');
   });
  });
});