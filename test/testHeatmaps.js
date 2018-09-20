const expect = require('chai').expect;
const assert = require('chai').assert;

const mongodbConnenctionModule = require('../src/database');

const heatmaps = require('../src/heatmaps');
const utilsHeatmaps = require('../utils/utilsHeatmaps');

const constants = require('../src/constants');
const Candle = require('../models/candleSchema');

describe('Check candles operations', () => {
  let dbCandles;

  before('connect', () => {
    return mongodbConnenctionModule.connect();
  });

  // TODO: check that this one is correct
  beforeEach('grab candles', async () => {
    let token = 'ADABTC';
    let period = '5m';

    this.dbCandles = await Candle.models[token].find().sort({time: 'descending'}).exec().then((res) => {
        return res;
    }).catch((err) => {
      console.log(token, 'beforeEach triggered exception');
    });
  });

  it('dummy test', () =>{
    expect(42).to.be.equal(42);
  });

  describe('filterCandles()', () => {
    // TODO: uncomment when you have enough candles in the database
    it.skip('should pick \'total\' candles with the specific \'period\' and return them sorted in descending order', () => {
      let numCandles = [constants.NUM_5M_CANDLES, constants.NUM_1H_CANDLES, constants.NUM_1D_CANDLES];
      let period = '5m';
      numCandles.forEach((total) => {
          let candles = heatmaps.filterCandles(this.dbCandles, total);
          expect(candles.length).to.be.equal(total);
      });
    });
  });

  describe('check helper functions', () => {
    it('getOpen():', () => {
      let step = 5;
      for (let i = 0; i < this.dbCandles.length; i += step) {
        let candlesSlice = this.dbCandles.slice(i, i + step);
        let val = utilsHeatmaps.getOpen(candlesSlice);
        expect(val).to.be.equal(this.dbCandles[i].open);
      }
    });

    it('getClose():', () => {
      let step = 5;
      for (let i = 0; i < this.dbCandles.length; i += step) {
        let candlesSlice = this.dbCandles.slice(i, i + step);
        let val = utilsHeatmaps.getClose(candlesSlice);
        expect(val).to.be.equal(this.dbCandles[i + candlesSlice.length - 1].close);
      }
    });

    it('getHigh():', () => {
      let step = 5;
      for (let i = 0; i < this.dbCandles.length; i += step) {
        let candlesSlice = this.dbCandles.slice(i, i + step);
        let val = utilsHeatmaps.getHigh(candlesSlice);
        // explicit way to find max
        let maxVal = 0;
        for (let j = 0; j < candlesSlice.length; j++){
          if (candlesSlice[j].high > maxVal)
            maxVal = candlesSlice[j].high;
        }
        expect(val).to.be.equal(maxVal);
      }
    });

    it('getLow():', () => {
      let step = 5;
      for (let i = 0; i < this.dbCandles.length; i += step) {
        let candlesSlice = this.dbCandles.slice(i, i + step);
        let val = utilsHeatmaps.getLow(candlesSlice);
        // explicit way to find min
        let minVal = Infinity;
        for (let j = 0; j < candlesSlice.length; j++){
          if (candlesSlice[j].low < minVal)
            minVal = candlesSlice[j].low;
        }

        expect(val).to.be.equal(minVal);
      }
    });

    it('getNumTrades():', () => {
      let step = 5;
      for (let i = 0; i < this.dbCandles.length; i += step) {
        let candlesSlice = this.dbCandles.slice(i, i + step);
        let val = utilsHeatmaps.getNumTrades(candlesSlice);
        let realVal = 0;
        candlesSlice.forEach(x => realVal += x.numTrades);
        expect(val).to.be.equal(realVal);
      }
    });

    it('getVolume():', () => {
      let step = 5;
      for (let i = 0; i < this.dbCandles.length; i += step) {
        let candlesSlice = this.dbCandles.slice(i, i + step);
        let val = utilsHeatmaps.getVolume(candlesSlice);
        let realVal = 0;
        candlesSlice.forEach(x => realVal += x.volume);
        expect(val).to.be.equal(realVal);
      }
    });

    it('getTime():', () => {
      let step = 5;
      for (let i = 0; i < this.dbCandles.length; i += step) {
        let candlesSlice = this.dbCandles.slice(i, i + step);
        let val = utilsHeatmaps.getTime(candlesSlice);
        expect(val).to.be.equal(this.dbCandles[i].time);
      }
    });

  });

});