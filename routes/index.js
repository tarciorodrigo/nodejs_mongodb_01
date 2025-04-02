const express = require('express');
const router = express.Router();
const db = require("../db");
const { request, response } = require('../app');

router.get('/', (request, response, next) => {
  response.render('index', { title: 'Bem vindo' });
});

module.exports = router;
