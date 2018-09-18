const Candle = require('./../models/candleSchema');
const Heatmap = require('./../models/heatmapSchema');

const getDeltaVolume = function(candles, numCandles = 4){
  // sum over the last 4 5min candles
  let res = 0;
  for (let j = 0; j < numCandles; j++)
      res += candles[j].volume;
  return res;
}

const getDeltaPrice = function(candles, numCandles = 4){
  // close (now) subtract open (20 min ago)
  let res = candles[0].close - candles[numCandles - 1].open;
  return res;
}

const getCurrentPrice = function(candles){
  // close (now)
  let res = candles[0].close;
  return res;
}

const getCurrentVolume = function(candles){
  // FIXME: should return 24 hours sliding volume
  // for the specific token
  return 0;
}

module.exports.debugOutput = function(candlestick){
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlestick;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;

    console.log(symbol + " " + interval + " candlestick update");
    console.log("isFinal: %s, open: %d, high: %d, low: %d, close: %d, volume: %d", isFinal, open, high, low, close, volume)
}

module.exports.debugOutputFromAPI = function(candlestick, pSymbol, pInterval){
  let [pTime, pOpen, pHigh, pLow, pClose, pVolume, pCloseTime, pAssetVolume, pTrades, pBuyBaseVolume, pBuyAssetVolume, pIgnored] = candlestick;

  console.log(pSymbol + " " + pInterval + " candlestick update");
  console.log("isFinal: %s, open: %d, high: %d, low: %d, close: %d, volume: %d", true, pOpen, pHigh, pLow, pClose, pVolume)
}

module.exports.createCandle = function(candlestick){
  let { e:eventType, E:eventTime, s:pSymbol, k:pTicks } = candlestick;
  let { o:pOpen, h:pHigh, l:pLow, c:pClose, v:pVolume, n:pTrades, i:pInterval, x:pIsFinal, q:pQuoteVolume, V:pBuyVolume, Q:pQuoteBuyVolume } = pTicks;
  let candle = new Candle.models[pSymbol]({
      // time: {type: Date},
      open: pOpen,
      close: pClose,
      high: pHigh,
      low: pLow,
      numTrades: pTrades,
      volume: pVolume,
      period: pInterval
    });
    return candle;
}

module.exports.createCandleFromAPI = function(candlestick, pSymbol, pInterval){
  let [pTime, pOpen, pHigh, pLow, pClose, pVolume, pCloseTime, pAssetVolume, pTrades, pBuyBaseVolume, pBuyAssetVolume, pIgnored] = candlestick;
  let candle = new Candle.models[pSymbol]({
    // time: {type: Date},
    open: pOpen,
    close: pClose,
    high: pHigh,
    low: pLow,
    numTrades: pTrades,
    volume: pVolume,
    period: pInterval
  });
  return candle;
}

module.exports.createHeatmap = function(token, candles5m, candles1h, candles1d){
  let heatmap = new Heatmap({
    'token': token,
    // 'time': {type : Date, default: Date.now},
    'volume' : getCurrentVolume(candles5m),
    'price' : getCurrentPrice(candles5m),
    'dVolume20min': getDeltaVolume(candles5m),
    'dPrice20min': getDeltaPrice(candles5m),
    'min' : candles5m,
    'hour' : candles1h,
    'day' : candles1d
  })
  return heatmap;
}