const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  name: String,
  location: String,
  starts: String,
  data: Date
});

module.exports = mongoose.model('Party', partySchema);