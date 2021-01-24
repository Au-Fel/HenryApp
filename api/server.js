require('dotenv').config();
const { DATABASE_URL, SECRET } = process.env;
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const session = require('express-session');

const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');

const server = express();

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
  db.dropDatabase();
  console.log('  🗃  Connected to database!\n  👨‍💻  Have fun! 👩‍💻');
});

// Middleware
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));
server.use(cors({
  origin: 'http://localhost:3000', // Client
  credentials: true
}));
server.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false
}));
server.use(cookieParser(SECRET));
server.use(morgan('dev'));
server.use(passport.initialize());
server.use(passport.session());
require('./src/passportConfig')(passport);

// server.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');
//   next();
// });

// Routes
server.use('/users', userRoutes);
server.use('/auth', authRoutes);

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

server.listen(5000, () => {
  console.log('  🚀 Server running on port 5000...');
});
