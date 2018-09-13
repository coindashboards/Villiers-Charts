// TODO: add functions for computations of the cells in the row for the specific token
const constants = require('./constants'); 
const utils = require('../utils/utils');

const Candle = require('../models/candleSchema');
let tokens = Object.keys(Candle.models);

// take only last 'total' candles from the whole array
const filterCandles = function(entries, period, total = 8){
    let res = entries.filter(el => el.period == period).sort((x, y) => {return y.time - x.time}).slice(0, total);
    return res;
}

const processCandles = function(token, data){
    // let candles1m = filterCandles(res, '1m', 8);
    let candles5m = filterCandles(data, '5m', 8);
    let candles1h = filterCandles(data, '1h', 8);
    let candles1d = filterCandles(data, '1d', 7); 
    let heatmap = utils.createHeatmap(token, candles5m, candles1h, candles1d);
    // console.log(heatmap);
    return heatmap;
}

// constructs the entry for the database that will be used later on the web-page
const updateHeatmap = function(date, token){
    let timeframe = new Date(date - constants.EXPIRATION_TIME_SECONDS);
    console.log(timeframe);

    Candle.models[token].find({
        'time': { $gte: timeframe }
    }).sort({time: 'descending'}).exec().then((res) => {
        // contains all necessary candles 
        let heatmap = processCandles(token, res);
        // TODO: save the corresponding heatmap in the collection
        heatmap.save();
    }).catch((err) => {
        console.log(token, 'triggered error');
    });
}

// TODO: this function should be triggered every 20 mins as on the webpage
tokens.forEach(token => {
    // console.log(token);
    // updateHeatmap(new Date(), token);
    setInterval(updateHeatmap, constants.UPDATE_TIME_INTERVAL, new Date(), token);
})