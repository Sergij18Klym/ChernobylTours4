const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    res.redirect(`/${uuidV4()}`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/:room', async (req, res) => {
  try {
    res.render('videotours/room', { roomId: req.params.room });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;