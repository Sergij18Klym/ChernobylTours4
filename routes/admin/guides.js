const express = require('express');
const router = express.Router();
const Guide = require('../../models/guide');
const Tour = require('../../models/tour');

// All guides Route
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const guides = await Guide.find(searchOptions);
    res.render('admin/guides/index', {
      guides: guides,
      searchOptions: req.query
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// New Driver Route
router.get('/new', (req, res) => {
  res.render('admin/guides/new', { guide: new Guide() })
});

// Create Driver Route
router.post('/', async (req, res) => {
  const guide = new Guide({
    name: req.body.name,
    phone: req.body.phone,
    salary: req.body.salary
  });
  try {
    const newGuide = await guide.save();
    res.redirect(`guides/${newGuide.id}`);
  } catch (err) {
    console.log(err);
    res.render('admin/guides/new', {
      guide: guide,
      errorMessage: err
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    const tours = await Tour.find({ guide: guide.id }).exec();
    res.render('admin/guides/show', {
      guide: guide,
      toursAssocCurrentGuide: tours
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    res.render('admin/guides/edit', { guide: guide });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/guides');
  }
});

router.put('/:id', async (req, res) => {
  let guide;
  try {
    guide = await Guide.findById(req.params.id);
    guide.name = req.body.name;
    guide.phone = req.body.phone;
    guide.salary = req.body.salary;
    await guide.save();
    res.redirect(`/admin/guides/${guide.id}`);
  } catch (err) {
    console.log(err);
    if (guide == null) {
      res.redirect('/');
    } else {
      res.render('admin/guides/edit', {
        guide: guide,
        errorMessage: 'Error updating Driver'
      });
    }
  }
});

router.delete('/:id', async (req, res) => {
  let guide;
  try {
    guide = await Guide.findById(req.params.id);
    await guide.remove();
    res.redirect('/admin/guides');
  } catch (err) {
    console.log(err);
    if (guide == null) {
      res.redirect('/');
    } else {
      res.redirect(`/admin/guides/${guide.id}`);
    }
  }
});

module.exports = router;