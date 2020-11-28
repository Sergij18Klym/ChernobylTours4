const mongoose = require('mongoose');
const Participant = require('./participant');

const customerSchema = new mongoose.Schema({
  createDate: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    minlength:3,
    maxlength:30
  },
  email: {
    type: String,
    required: true,
    minlength:3,
    maxlength:30
  },
  password: {
    type: String,
    required: true
  }
});

customerSchema.pre('remove', function(next) {
  Participant.find({ customer: this.id }, (err, participants) => {
    if (err) {
      next(err);
    } else if (participants.length > 0) {
      next(new Error('You cannot delete a Customer who is a Participant in an existing Tour'));
    } else {
      next();
    }
  })
});

module.exports = mongoose.model('Customer', customerSchema);