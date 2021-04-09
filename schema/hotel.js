const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    unique: true,
    required: true
  },
  manager: {
    type: String,
    required: true
  },
  rooms: {
    type: Array,
    unique: false,
    required: false
  }
});

const Hotels = mongoose.model('hotels', hotelSchema);

module.exports = Hotels;