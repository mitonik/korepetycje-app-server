const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const routes = require('./routes/routes');

const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT;

const server = express();

server.use(express.json());
server.use(cors({ origin: true, credentials: true }));
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

mongoose.connect(DB_HOST)
  .then(() => {
    server.listen(PORT);
    console.log('Server listening on port', PORT);
  })
  .catch(err => {
    console.log(err);
  });

server.use(routes);
