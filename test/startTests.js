// this script is mainly for test purposes
// will be extended later on for full set of tests
require('dotenv').config({path: './.env'});

// TODO: do I need to connect here or somewhere else?
const mongoose = require('mongoose');
// TODO: check if this is necessary at all
mongoose.Promise = global.Promise;
const mongodbConnenctionModule = require('../src/database');
mongodbConnenctionModule.connect();

require('./testCandlesConsecutive');