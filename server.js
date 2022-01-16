const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const cors = require('cors');
const history = require('connect-history-api-fallback')
require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT;

const options = {
  cert: process.env.CERT,
  key: process.env.KEY
}

const server = express();
const serverHttps = https.createServer(options, server);

server.use(express.json());
server.use(cors({ origin: true, credentials: true }));
server.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_HOST)
  .then(() => {
    serverHttps.listen(PORT);
    console.log('Server listening on port', PORT);
  })
  .catch(err => {
    console.log(err);
  });

server.use('/v1', require('./routes/v1'));
server.use(history());
server.use(express.static('public'));
