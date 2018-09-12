// TODO: add functions for computations of the cells in the row for the specific token

require('dotenv').config({path: './../.env'});
const constants = require('./constants'); 

const mongoose = require('mongoose');
const Candle = require('./../models/candleSchema');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, poolSize: 50}, (err) => {
  if (err)
    console.log(err);
  else 
    console.log('Connected to MongoDB')
});

// TODO: remove once done
const filterCandles2 = function(entries, fieldValue){
    let res = entries.filter(el => el.numTrades > fieldValue);
    return res;
}

const filterCandles = function(entries, period){
    let res = entries.filter(el => el.period == period);
    // TODO: sort the elements and take the first 8 / 8 / 7 elements 
    return res;
}

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
    // FIXME: figure out where do we take this value from 
    return 0;
}


// constructs the entry for the database that will be used later on the web-page
const createTokenInfo = function(date, token){
    console.log(date);
    console.log(new Date((date - constants.TIME_40_MINS))); 

    Candle.models[token].find({
        'time': { $gte: new Date((date - constants.TIME_40_MINUTES))}
    }).sort({time: 'descending'}).exec((err, res) => {
        if(err) console.log(err);
        // contains all necessary candles 
        
        let fres = filterCandles2(res, 80);
        // let candles1m = filterCandles(res, '1m');
        let candles5m = filterCandles(res, '5m');
        let candles1h = filterCandles(res, '1h');
        let candles1d = filterCandles(res, '1d'); 
        console.log(fres);


        // use 'period' field in the candles 

        let heatmap = new Heatmap({
            'token': token,
            // TODO: set by default
            // 'time': {type : Date, default: Date.now},
            // TODO: grab it separately?!
            'volume' : getCurrentVolume(),
            // TODO: take the last one that was available ?  
            'price' : getCurrentPrice(),
            
            'dVolume20min': getDeltaVolume(),
            'dPrice20min': getDeltaPrice(),
            'min' : candles5m, 
            'hour' : candles1h,
            'day' : candles1d
        })

    });

    // console.log('Magic happened?');
    // console.log(date);
    // 8 fields
    // 0 - 5	5 - 10	10 - 15	15 - 20	20 - 25	25 - 30	30 - 35	35 - 40
    // 8 fields
    // 0 - 1	1 - 2	2 - 3	3 - 4	4 - 5	5 - 6	6 - 7	7 - 8
    // 7 fields
    // 0 - 1	1 - 2	2 - 3	3 - 4	4 - 5	5 - 6	6 - 7
}

// 2018-09-06 08:47:04.356
// 2018-09-06T08:47:04.000Z

// FIXME: remember to use correct timezone when testing the code
// UTC +0
createTokenInfo(new Date(2018, 8, 6, 8, 47, 4), 'ADABTC');

// interval should be 5 mins (as the smallest candlestick that is available)
// setInterval(f, 5000);