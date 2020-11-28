const express = require('express');
const router = express.Router();
const Participant = require('../../models/participant');
const Customer = require('../../models/customer');
const Tour = require('../../models/tour');

router.get('/', async (req, res) => {
  let query = Participant.find();
  if (req.query.createBefore != null && req.query.createBefore != '') {
    query = query.lte('createDate', req.query.createBefore)
  }
  if (req.query.createAfter != null && req.query.createAfter != '') {
    query = query.gte('createDate', req.query.createAfter)
  }
  try {
    const participants = await query.exec();
    res.render('admin/participants/index', {
      participants: participants,
      searchOptions: req.query
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/new', async (req, res) => {
  renderNewPage(res, new Participant());
});

router.post('/', async (req, res) => {
  const participant = new Participant({
    customer: req.body.customer,
    tour: req.body.tour
  });
  try {
    const newParticipant = await participant.save();
    res.redirect(`participants/${newParticipant.id}`);
  } catch (err) {
    console.log(err);
    renderNewPage(res, participant, true);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id).populate(['customer', 'tour']).exec();
    res.render('admin/participants/show', { participant: participant });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    renderEditPage(res, participant);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
})

router.put('/:id', async (req, res) => {
  let participant;
  try {
    participant = await Participant.findById(req.params.id)
    participant.customer = req.body.customer;
    participant.tour = req.body.tour;
    await participant.save();
    res.redirect(`/admin/participants/${participant.id}`);
  } catch (err) {
    console.log(err);
    if (participant != null) {
      renderEditPage(res, participant, true);
    } else {
      redirect('/');
    }
  }
});

router.delete('/:id', async (req, res) => {
  let participant;
  try {
    participant = await Participant.findById(req.params.id);
    await participant.remove();
    res.redirect('/admin/participants');
  } catch (err) {
    if (participant != null) {
      res.render('admin/participants/show', {
        participant: participant,
        errorMessage: err
      });
    } else {
      res.redirect('/');
    }
  }
});

async function renderNewPage(res, participant, hasError = false) {
  renderFormPage(res, participant, 'new', hasError);
}

async function renderEditPage(res, participant, hasError = false) {
  renderFormPage(res, participant, 'edit', hasError);
}

async function renderFormPage(res, participant, form, hasError = false) {
  try {
    const customers = await Customer.find({});
    const tours = await Tour.find({});
    const params = {
      customers: customers,
      tours: tours,
      participant: participant
    };
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Participant';
      } else {
        params.errorMessage = 'Error Creating Participant';
      }
    }
    res.render(`admin/participants/${form}`, params);
  } catch (err) {
    console.log(err);
    res.redirect('/admin/participants');
  }
}

module.exports = router;