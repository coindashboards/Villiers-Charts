module.exports.debugOutput = function(candlestick){
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlestick;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
  
    console.log(symbol + " " + interval + " candlestick update");
    console.log("open: " + open);
    console.log("high: " + high);
    console.log("low: " + low);
    console.log("close: " + close);
    console.log("volume: " + volume);
    console.log("isFinal: " + isFinal);
}