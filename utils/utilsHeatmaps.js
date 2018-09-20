const getOpen = function(candles) {
  return candles[0].open;
}

const getClose = function(candles) {
  return candles[candles.length - 1].close;
}

const getHigh = function(candles){
  return Math.max(...candles.map(x => x.high), 0);
}

const getLow = function(candles){
  return Math.min(...candles.map(x => x.low), Infinity);
}

const getNumTrades = function(candles) {
  return candles.map(item => item.numTrades).reduce((prev, next) => prev + next);
}

const getVolume = function(candles) {
  return candles.map(item => item.volume).reduce((prev, next) => prev + next);
}

const getTime = function(candles){
  // TODO: check that time is actually correct
  return candles[0].time;
}

module.exports = {
  getOpen,
  getClose,
  getHigh,
  getLow,
  getNumTrades,
  getVolume,
  getTime
}