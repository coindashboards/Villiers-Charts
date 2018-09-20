/**
 * grad all btc markets and save them in the file
 * TODO: write the markets to the database?
 */

// TODO: need this one ?
require('dotenv').config();

const binance = require('node-binance-api')();
const fs = require('fs');

const filterMarkets = function(tickers, token){
    let btcTickers = tickers.filter(ticker => ticker.endsWith(token)).sort();
    return btcTickers;
}

const dumpTickers = function(tickers, filename){
    let fileStream = fs.createWriteStream(filename);
    fileStream.on('error', (err) => {
       console.log('Something went wrong on file writing.\n', err);
    });
    tickers.forEach(v => fileStream.write(v  + '\n'));
    fileStream.end();
}

binance.prices((error, tickers) => {
    // save all btc tickers
    let btcTickers = filterMarkets(tickers, 'BTC');
    console.log(btcTickers);
    console.log('Got all btc tickers');
    // dump all btc tickers to the file
    dumpTickers(btcTickers, BTC_MARKETS_FILE);
});