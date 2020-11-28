const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Customer = require('../../models/customer');
const { forwardAuthenticated } = require('../../public/authjs/auth');

router.get('/login', forwardAuthenticated, (req, res) => res.render('client/login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('client/register'));

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    Customer.findOne({ email: email }).then(customer => {
      if (customer) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newCustomer = new Customer({
          name,
          email,
          password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newCustomer.password, salt, (err, hash) => {
            if (err) throw err;
            newCustomer.password = hash;
            newCustomer
              .save()
              .then(customer => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/client/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/client-cabinet',
    failureRedirect: '/client/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/client/login');
});

module.exports = router;