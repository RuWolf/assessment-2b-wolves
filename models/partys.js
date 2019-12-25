const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  name: String,
  location: String,
  starts: Date,
  author: String

});

module.exports = mongoose.model('Party', partySchema);