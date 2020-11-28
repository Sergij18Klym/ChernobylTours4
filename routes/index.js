const express = require('express');
const router = express.Router();
const { checkAuth } = require('../public/authjs/auth');

router.get('/', checkAuth, (req, res) => {
	/*
	let logStatus = {};
	if (req.user) {
		logStatus = "log-in" req.user.email;
	} else {
		logStatus = "log-out";
	}	
	*/
  res.render('index', { /*logStatus: logStatus,*/ loginStatus: req.user });
});

module.exports = router;