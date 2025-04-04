const express = require('express');
const router = express.Router();
const auth = require("../auth");
const bcrypt = require("bcrypt");
const db = require('../db');
const sendMail = require("../mail");

router.get('/', (request, response, next) => {
  response.render('login', { title: 'Login', message: "" });
});

router.get('/forgot', (request, response, next) => {
  response.render('forgot', { title: 'Recuperação de senha', message: "" });
});

router.post('/forgot', async (request, response, next) => {
  const email = request.body.email;

  if (!email)
    return response.render('forgot', { title: 'Recuperação de senha', message: "O e-mail é obrigatório" });

  const user = await auth.findUserByEmail(email);

  if (!user)
    return response.render("forgot", { title: "Login", message: "E-mail não encontrado" })
  
  const newPassword = auth.generatePassword();
  user.senha = newPassword;

  await db.updateUser(user._id.toString(), user);

  try {
    await sendMail(user.email, "Senha temporaria gerado com sucesso", `
      Olá ${user.nome}!
      Sua senha foi alterada com sucesso para ${newPassword}.

      Use-a para se autenticar novamente em http://localhost:3000/

      Att.

      Admin
    `);

    response.render("login", { title: "Login", message: "Verifique sua caixa de email para pegar sua nova senha." });
  }
    catch(err) {
      response.render("forgot", { title: "Recuperação de senha", message: err.message });
  }
});

router.post('/login', async (request, response, next) => {
  const nome = request.body.nome;
  const user = await auth.findUserByNome(nome);

  if (!user)
    return response.render("login", { title: "Login", message: "Usuário e/ou senha inválidos" })

  const senha = request.body.senha;
  
  // if (user.senha !== senha)
  //   return response.render("login", { title: "Login", message: "Usuário e/ou senha inválidos" })

  if (!bcrypt.compareSync(senha, user.senha))
    return response.render("login", { title: "Login", message: "Usuário e/ou senha inválidos" })

  response.redirect('/index');
});

module.exports = router;
