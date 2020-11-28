const express = require('express');
const router = express.Router();/*
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardSuccessAuthenticated } = require('../../public/authjs/auth');*/
const Tour = require('../../models/tour');
const Customer = require('../../models/customer');
const Participant = require('../../models/participant');

router.get('/', (req, res) => {
  res.redirect('../');
});

router.get('/oneday-tours', async (req, res) => {
  let query = Tour.find({ tourType: 'oneDay', actual: true });
  if (req.query.language != null && req.query.language != '') {
    query = query.regex('language', new RegExp(req.query.language, 'i'))
  }
  //query.gte('startDate', Date.now());
  try {
    const tours = await query.sort({ startDate: 'desc' }).exec();
    console.log(req.query);
    res.render('client/tourtypes', { 
      tours: tours,
      tourOne: 'oneday-tours',
      tourLanguage: req.query.language
    });
  } catch (err) {
    console.log(err);
    tours = [];
    res.redirect('/oneday-tours');
  }
});

router.get('/twoday-tours', async (req, res) => {
  let tours;
  try {
    tours = await Tour.find({ tourType: 'twoDay', actual: true }).sort({ startDate: 'desc' }).exec();
  } catch {
    tours = [];
  }
  res.render('client/tourtypes', { tours: tours });
});

router.get('/booking', (req, res) => {
  res.redirect('../');
});

router.get('/booking/:id', /*forwardSuccessAuthenticated,*/ async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.render('client/booking', { 
    	tour: tour, 
    	customer: new Customer(), 
    	participant: new Participant() 
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    email: req.body.email
  });
  try {
    const newCustomer = await customer.save();

  const participant = new Participant({
    customer: newCustomer,
    tour: req.body.tour
  });
  const newParticipant = await participant.save();

    res.redirect(`tour-configuration/success/${newCustomer.id}`);
  } catch (err) {
    console.log(err);
    res.render('admin/customers/new', {
      customer: customer,
      errorMessage: err
    });
  }
});

router.get('/success/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const participants = await Participant.find({ customer: customer.id }).exec();
    let tourArray = [];
    participants.forEach(participant =>
      tourArray.push(participant.tour)
    )
    const tour = await Tour.find({ _id : { "$in" : tourArray }}).exec();
    res.render('client/success', { 
      customer: customer, 
      tour: tour
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;