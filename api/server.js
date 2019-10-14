const express = require('express');

const server = express();

server.use(express.json());

const usersRouter = require('../users/usersRouter');

server.use('/api', usersRouter)

module.exports = server;