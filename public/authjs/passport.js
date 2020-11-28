const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const Customer = require('../../models/customer');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      Customer.findOne({
        email: email
      }).then(customer => {
        if (!customer) {
          return done(null, false, { message: 'That email is not registered' });
        }
        bcrypt.compare(password, customer.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, customer);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(customer, done) {
    done(null, customer.id);
  });

  passport.deserializeUser(function(id, done) {
    Customer.findById(id, function(err, customer) {
      done(err, customer);
    });
  });
};