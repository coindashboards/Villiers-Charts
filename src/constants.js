module.exports = {
    UPDATE_TIME_INTERVAL : 5 * 60 * 1000,
    DELTA_TIME_BETWEEN_CANDLES : 5 * 60 * 1000, // TODO: should it be 5 * 60 * 1000 not 60 * 1000?
    TIME_1_MINUTE: 60 * 1000,
    TIME_30_SECONDS: 30 * 1000,
    TIME_40_MINUTES: 40 * 60 * 1000,
    TIME_8_HOURS: 8 * 60 * 60 * 1000,
    TIME_7_DAYS: 7 * 24 * 60 * 60 * 1000,
    EXPIRATION_TIME_SECONDS: 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000, // 7 days + 1 hour
    MONGOBD_POOLSIZE: 50,
    AUTHOR : 'milkyklim'
}