if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

app.set('port', process.env.PORT || 3000);
//const server = require('http').Server(app);
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

require('./public/authjs/passport')(passport);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));


app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin/index'));
app.use('/admin/tours', require('./routes/admin/tours'));
app.use('/admin/customers', require('./routes/admin/customers'));
app.use('/admin/participants', require('./routes/admin/participants'));
app.use('/admin/guides', require('./routes/admin/guides'));

app.use('/tour-configuration', require('./routes/client/tourconfig'));
app.use('/client-cabinet', require('./routes/client/cabinet'));

app.use('/client', require('./routes/client/loginRegister'));

app.use('/videotours', require('./routes/videotours'));



//app.use('/videotoursz', require('./routes/wrong'));


io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});


const colleczion = db.collection("tours");
const filter = { startDate: { $lte : new Date() } };
const updateDoc = { $set: { actual: false } };
const result = colleczion.updateMany(filter, updateDoc);
console.log(
  `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
);

//app.listen(process.env.PORT || 3000);
server.listen(app.get('port'));
