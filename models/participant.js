const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  createDate: {
    type: Date,
    default: Date.now
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer'
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tour'
  }
});

module.exports = mongoose.model('Participant', participantSchema);