const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    unique: false,
    required: true
  },
  number: {
    type: Number,
    unique: true,
    required: true
  },
  booked: {
    type: Boolean,
    unique: false,
    required: true,
    default: false
  },
  beds: {
    type: Number,
    unique: false,
    required: true,
    default: 2
  }
});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;