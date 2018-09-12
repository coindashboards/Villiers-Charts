const mongoose = require('mongoose');

module.exports.connect = function() {
	mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, poolSize: 50});
	mongoose.set('useCreateIndex', true);
	let db = mongoose.connection;
	db.on("error", console.error.bind(console, "Connection error"));
	db.once("open", (res) => {
	  console.log("Connected to MongoDB");
	});
	return db;
}