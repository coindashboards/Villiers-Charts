// this script is mainly for test purposes
// will be extended later on for full set of tests
require('dotenv').config();
// TODO: do I need to connect here or somewhere else?
const mongoose = require('mongoose');
const Candle = require('./../models/candleSchema');

const constants = require('./../constants.js'); 

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, poolSize: 50}, (err) => {
  if (err)
    console.log(err);
  else 
    console.log('Connected to MongoDB')
});

// 1. test that all candels are really consequitive and none of the are missing
let tokens = Object.keys(Candle.models);

tokens.forEach(token => {
    Candle.models[token].find({"time": {$gte: new Date(2018, 8, 6)}}).sort({date: 'ascending'}).exec((err, res) => {
        if (err){
            console.log(err);
            return;
        }
        let isOk = true;
        let n = res.length;
        for (let j = 0; j < n - 1; j++){
            // websockets, sometimes, reply with the delay
            // + there might be difference in milliseconds 
            // that's why we drop thm before the comparison
            // good delta_t is 60 000
            let dT =  res[j + 1].time.setSeconds(0,0) - res[j].time.setSeconds(0,0);
            if (dT != constants.DELTA_TIME_BETWEEN_CANDLES){
                // TODO: add some self repairing mechanism 
                console.log('%s : %s -> %s', token, res[j].time, res[j + 1].time);
                isOk = false;
            }
            // TODO: 
            // [ ] take the candle date 
            // [ ] take the next candle date 
            // [ ] query the missing data FIXME: remember that  you might hit the query limit 
            
        }
    });
});