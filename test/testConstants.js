const expect = require('chai').expect;
const constants = require('../src/constants');

describe('CONSTANTS', () => {
  it('check that all constants contain expected values', () => {
    expect(constants.UPDATE_TIME_INTERVAL).to.be.equal(5 * 60 * 1000);
    expect(constants.DELTA_TIME_BETWEEN_CANDLES).to.be.equal(5 * 60 * 1000);
    expect(constants.TIME_1_MINUTE).to.be.equal(60 * 1000);
    expect(constants.TIME_30_SECONDS).to.be.equal(30 * 1000);
    expect(constants.TIME_40_MINUTES).to.be.equal(40 * 60 * 1000);
    expect(constants.TIME_8_HOURS).to.be.equal(8 * 60 * 60 * 1000);
    expect(constants.TIME_7_DAYS).to.be.equal(7 * 24 * 60 * 60 * 1000);
    expect(constants.EXPIRATION_TIME_SECONDS).to.be.equal(7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000); // 7 days + 1 hour

    expect(constants.NUM_5M_CANDLES).to.be.equal(8);
    expect(constants.NUM_1H_CANDLES).to.be.equal(8 * 60 / 5);
    expect(constants.NUM_1D_CANDLES).to.be.equal(7 * 24 * 60 / 5);
    // subject of change
    expect(constants.MONGOBD_POOLSIZE).to.be.equal(50);
  });
});

