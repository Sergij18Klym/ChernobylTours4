const express = require('express');
const router = express.Router();
const Tour = require('../../models/tour');

router.get('/', async (req, res) => {
  let tours;
  try {
    tours = await Tour.find().sort({ createDate: 'desc' }).limit(10).exec();
  } catch {
    tours = [];
  }
  res.render('admin/index', { tours: tours });
});

module.exports = router;