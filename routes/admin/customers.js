const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const Participant = require('../../models/participant');

router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const customers = await Customer.find(searchOptions);
    res.render('admin/customers/index', {
      customers: customers,
      searchOptions: req.query
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/new', (req, res) => {
  res.render('admin/customers/new', { customer: new Customer() })
});

router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    email: req.body.email
  });
  try {
    const newCustomer = await customer.save();
    res.redirect(`customers/${newCustomer.id}`);
  } catch (err) {
    console.log(err);
    res.render('admin/customers/new', {
      customer: customer,
      errorMessage: err
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const participants = await Participant.find({ customer: customer.id }).exec();
    res.render('admin/customers/show', {
      customer: customer,
      customersParticipations: participants
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.render('admin/customers/edit', { customer: customer });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/customers');
  }
});

router.put('/:id', async (req, res) => {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    customer.name = req.body.name;
    customer.email = req.body.email;
    await customer.save();
    res.redirect(`/admin/customers/${customer.id}`);
  } catch (err) {
    console.log(err);
    if (customer == null) {
      res.redirect('/');
    } else {
      console.log(err);
      res.render('admin/customers/edit', {
        customer: customer,
        errorMessage: err
      });
    }
  }
});

router.delete('/:id', async (req, res) => {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    await customer.remove();
    res.redirect('/admin/customers');
  } catch (err) {
    console.log(err);
    if (customer == null) {
      res.redirect('/');
    } else {
      res.redirect(`/admin/customers/${customer.id}`);
    }
  }
});

module.exports = router;