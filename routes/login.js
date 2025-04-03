const express = require('express');
const router = express.Router();
const { findUser } = require("../auth");

router.get('/', (request, response, next) => {
  response.render('login', { title: 'Login', message: "" });
});

router.post('/login', async (request, response, next) => {
  const nome = request.body.nome;
  const user = await findUser(nome);

  if (!user)
    //return response.sendStatus(404);
    return response.render("login", { title: "Login", message: "Usuário e/ou senha inválidos" })

  const senha = request.body.senha;
  
  if (user.senha !== senha)
    //return response.sendStatus(401);
    return response.render("login", { title: "Login", message: "Usuário e/ou senha inválidos" })

  response.redirect('/index');
});

module.exports = router;
