const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../public/authjs/auth');
const Tour = require('../../models/tour');
const Customer = require('../../models/customer');
const Participant = require('../../models/participant');

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const participants = await Participant.find({ customer: customer.id }).exec();
    let tourArray = [];
    participants.forEach(participant =>
      tourArray.push(participant.tour)
    )
    const tours = await Tour.find({ _id : { "$in" : tourArray }}).exec();
    res.render('client/cabinet', { 
      customer: customer, 
      customersParticipations: participants,
      customersTours: tours
    });
  } catch (err) {
    console.log(err);
    res.redirect('../');
  }
});

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const customer = await req.user;
    const participants = await Participant.find({ customer: customer.id }).exec();
    let tourArray = [];
    participants.forEach(participant =>
      tourArray.push(participant.tour)
    )
    const tours = await Tour.find({ _id : { "$in" : tourArray }}).exec();
    res.render('client/cabinet2', { 
      user: customer,
      customersParticipations: participants,
      customersTours: tours    
    });
  } catch (err) {
    console.log(err);
    res.redirect('../');
  }
});

module.exports = router;