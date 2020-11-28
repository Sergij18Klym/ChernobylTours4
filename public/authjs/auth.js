module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/client/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/client-cabinet');      
  },
  forwardSuccessAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/tour-configuration/success');      
  },
  checkAuth: function(req, res, next) {
    let routeparam = req.params;
    console.log("checkauth AAA " + routeparam);
    let logStatus = {};
    if (req.isAuthenticated()) {
      logStatus = "log-in";
      console.log("LOGGin " + logStatus);
      return next();
    } else if (!req.isAuthenticated()) {
      logStatus = "log-out";
      console.log("LOGGout " + logStatus);
      return next();
    }
    //res.redirect(routeparam, logStatus);
    //res.redirect("/", logStatus);
  }
  
  /*,
  checkYes: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  },
  checkNo: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  }
  */
};