const express = require('express');
const router = express.Router();
const auth = require("../auth");
const db = require('../db');
const sendMail = require("../mail");
const passport = require("passport");

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

router.post('/login', passport.authenticate("local", {
  successRedirect: "/index",
  failureRedirect: "/?message=Usuário e/o senha inválidos.",
}));

module.exports = router;
