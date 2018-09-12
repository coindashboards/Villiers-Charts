// TODO: add functions for computations of the cells in the row for the specific token

require('dotenv').config({path: './../.env'});
const constants = require('./constants'); 
const utils = require('./../utils/utils.js');

const mongoose = require('mongoose');
const Candle = require('./../models/candleSchema');

// TODO: remove this part because you will be connected to the database already
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, poolSize: 50}, (err) => {
  if (err)
    console.log(err);
  else 
    console.log('Connected to MongoDB')
});

const filterCandles = function(entries, period, total = 8){
    let res = entries.filter(el => el.period == period).sort((x, y) => {return y.time - x.time}).slice(0, total);
    return res;
}


// constructs the entry for the database that will be used later on the web-page
const createTokenInfo = function(date, token){
    console.log(date);
    console.log(new Date((date - constants.TIME_40_MINUTES))); 

    Candle.models[token].find({
        'time': { $gte: new Date((date - constants.TIME_40_MINUTES))}
    }).sort({time: 'descending'}).exec((err, res) => {
        if(err) console.log(err);
        // contains all necessary candles 
        // DEBUG: 
        // let candles1m = filterCandles(res, '1m', 8);
        let candles5m = filterCandles(res, '5m', 8);
        let candles1h = filterCandles(res, '1h', 8);
        let candles1d = filterCandles(res, '1d', 7); 
        // console.log(candles1h);

        let heatmap = utils.createHeatmap(token, candles5m, candles1h, candles1d);
        console.log(heatmap);

        // TODO: clean the heatmap collection before saving new entries there

        // TODO: save the corresponding heatmap in the collection
        // heatmap.save()
        // .catch((err) => console.log(err))
        // .then(() => console.log('%s: heatmap row is saved', token));
    });
}

// 2018-09-06 08:47:04.356
// 2018-09-06T08:47:04.000Z

// FIXME: remember to use correct timezone when testing the code
// UTC +0
createTokenInfo(new Date(2018, 8, 6, 8, 47, 4), 'ADABTC');
// createTokenInfo(new Date().now, 'ADABTC');

// interval should be 5 mins (as the smallest candlestick that is available)
// setInterval(f, 5000);

timeframes.forEach((p) => {
    getCandlesticks(tokens, p);
});