const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/users');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

const server = express();

mongoose.connect(`mongodb://${HOST}:27017/korepetycje`).then(() => server.listen(PORT));

server.use(express.json());
server.use(cors({ origin: true, credentials: true }));
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: MAX_AGE });
}

server.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(() => {
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
      res.sendStatus(201);
    })
    .catch(() => {
      res.sendStatus(403);
    })
});

server.get('/users', (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, SECRET, (err) => {
      if (err) {
        res.sendStatus(401)
      } else {
        User.find()
          .then((result) => {
            res.send(result);
          })
          .catch(() => {
            res.sendStatus(404);
          });
      }
    });
  } else {
    res.sendStatus(401);
  }
});

server.get('/user/:id', (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.sendStatus(403);
    });
})

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = User.login(email, password)
  if (user) {
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
    res.send('login');
  } else {
    console.log('error');
  }
})