const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const heatmapSchema = new Schema({
  token: String,
  time: {type : Date, default: Date.now},

  volume : {type : Number }, 
  price : {type : Number},

  dVolume20min: {type : Number},
  dPrice20min: {type : Number},
  // 8 fields
  // 0 - 5	5 - 10	10 - 15	15 - 20	20 - 25	25 - 30	30 - 35	35 - 40
  min : {type : Array , "default" : []}, 
  // 8 fields
  // 0 - 1	1 - 2	2 - 3	3 - 4	4 - 5	5 - 6	6 - 7	7 - 8
  hour : {type : Array , "default" : []},
  // 7 fields
  // 0 - 1	1 - 2	2 - 3	3 - 4	4 - 5	5 - 6	6 - 7
  day : {type : Array , "default" : []} 
});

const Heatmap = mongoose.model("Heatmap", heatmapSchema);
module.exports = Heatmap;
