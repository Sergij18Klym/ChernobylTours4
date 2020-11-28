const mongoose = require('mongoose');
const Tour = require('./tour');

const guideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength:3,
    maxlength:30
  },
  phone: {
    type: String,
    required: true,
    minlength:6,
    maxlength:12
  },
  salary: {
    type: Number,
    required: true,
    default: 2400.00,
    min:1000,
    max:20000
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

guideSchema.pre('remove', function(next) {
  Tour.find({ guide: this.id }, (err, tours) => {
    if (err) {
      next(err);
    } else if (tours.length > 0) {
      next(new Error('You cannot delete a Guide associated with an existing Tour'));
    } else {
      next();
    }
  })
});

module.exports = mongoose.model('Guide', guideSchema);