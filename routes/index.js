const express = require('express');
const router = express.Router();
const db = require("../db");

router.get('/', (request, response, next) => {
  console.log(request.body.profile);
  response.render('index', { title: 'Bem vindo', userProfile: parseInt(request.user.profile) });
});

module.exports = router;
