const Candle = require('./../models/candleSchema');

module.exports.debugOutput = function(candlestick){
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlestick;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
  
    console.log(symbol + " " + interval + " candlestick update");
    console.log("isFinal: %s, open: %d, high: %d, low: %d, close: %d, volume: %d", isFinal, open, high, low, close, volume)    
}

module.exports.createCandle = function(candlestick, p){
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
      period: p
    });
    return candle;
  }

module.exports.createHeatmapRow = function(){
  
}