const express = require('express');
const router = express.Router();
const Tour = require('../../models/tour');
const Participant = require('../../models/participant');
const Guide = require('../../models/guide');

// All Tours Route
router.get('/', async (req, res) => {
  let query = Tour.find();
  if (req.query.tourType != null && req.query.tourType != '') {
    query = query.regex('tourType', new RegExp(req.query.tourType, 'i'))
  }
  if (req.query.startBefore != null && req.query.startBefore != '') {
    query = query.lte('startDate', req.query.startBefore)
  }
  if (req.query.startAfter != null && req.query.startAfter != '') {
    query = query.gte('startDate', req.query.startAfter)
  }
  try {
    const tours = await query.exec();
    res.render('admin/tours/index', {
      tours: tours,
      searchOptions: req.query
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// New Tour Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Tour());
});

// Create Tour Route
router.post('/', async (req, res) => {
  const tour = new Tour({
    tourType: req.body.tourType,
    startDate: new Date(req.body.startDate),
    actual: (req.body.actual == undefined ? false : true),
    language: req.body.language,
    guide: req.body.guide
  });
  try {
    const newTour = await tour.save();
    res.redirect(`tours/${newTour.id}`);
  } catch (err) {
    console.log(err);
    renderNewPage(res, tour, true);
  }
})

// Show Tour Route
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate(['guide']).exec();
    const participants = await Participant.find({ tour: tour.id }).exec();
    res.render('admin/tours/show', { 
      tour: tour,
      toursParticipants: participants 
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
})

// Edit Tour Route
router.get('/:id/edit', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    renderEditPage(res, tour);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
})

// Update Tour Route
router.put('/:id', async (req, res) => {
  let tour;
  try {
    tour = await Tour.findById(req.params.id)
    tour.tourType = req.body.tourType;
    tour.startDate = new Date(req.body.startDate);
    tour.actual = (req.body.actual == undefined ? false : true);
    tour.language = req.body.language;
    tour.guide = req.body.guide;
    await tour.save();
    res.redirect(`/admin/tours/${tour.id}`);
  } catch (err) {
    console.log(err);
    if (tour != null) {
      renderEditPage(res, tour, true);
    } else {
      redirect('/');
    }
  }
});

// Delete Tour Page
router.delete('/:id', async (req, res) => {
  let tour;
  try {
    tour = await Tour.findById(req.params.id);
    await tour.remove();
    res.redirect('/admin/tours');
  } catch (err) {
    if (tour != null) {
      res.render('admin/tours/show', {
        tour: tour,
        errorMessage: 'Could not remove Tour ' + err
      });
    } else {
      res.redirect('/');
    }
  }
});

async function renderNewPage(res, tour, hasError = false) {
  renderFormPage(res, tour, 'new', hasError);
}

async function renderEditPage(res, tour, hasError = false) {
  renderFormPage(res, tour, 'edit', hasError);
}

async function renderFormPage(res, tour, form, hasError = false) {
  try {
    const guides = await Guide.find({});
    const params = {
      guides: guides,
      tour: tour
    };
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Tour';
      } else {
        params.errorMessage = 'Error Creating Tour';
      }
    }
    res.render(`admin/tours/${form}`, params);
  } catch (err) {
    console.log(err);
    res.redirect('/admin/tours');
  }
}

module.exports = router;