const express = require('express');
const router = express.Router();
const db = require("../db");
const { request, response } = require('../app');

/* GET home page. */
// router.get('/', (req, res, next) => {
//   db.findCustomer((error, docs) => {
//     if (error)
//       return console.log(error);

//     console.log(docs);
//     res.render('index', { title: 'Express' });
//   });
// });

// router.post('/new', (req, res, next) => {
//   if (req.body.id)
//     db.updateCustomer(req.body.id, {name: req.body.name, address: req.body.address, cpf: req.body.cpf });
//   else
//     db.addCustomer(req.body.name, req.body.address, req.body.cpf);

//   res.redirect("/customers/");
// });
router.post('/new', (request, response, next) => {
  const id = request.body.id;

  if (!request.body.nome)
    return response.redirect("/users/new?error=O campo nome é obrigatório");

  if (!id && !request.body.senha)
    return response.redirect("/users/new?error=O campo senha é obrigatório");
  
  const nome = request.body.nome;
  const email = request.body.email;
  
  const user = { nome, email };

  if (request.body.senha)
    user.senha = request.body.senha;

  const promise = id
                ? db.updateUser(id, user)
                : db.insertUser(user)

  promise
    .then(result => {
      response.redirect("/");
    })
    .catch(error => {
      console.log(error);      
      response.render("error", { message: "Erro ao salvar usuário", error });
    })
});

router.get('/delete/:userId', (request, response) => {
  const id = request.params.userId;
  db.deleteUser(id)
    .then(result => {
      response.redirect("/users");
    })
    .catch(error => {
      console.log(error);
      response.render("error", { message: "Erro ao excluir cliente", error });
    });  
});

router.get("/edit/:userId", (request, response) => {
  const id = request.params.userId;
  db.findUser(id)
    .then(user => {
      console.log(user);
      response.render('user', { title: 'Editar Usuário', user });
    })
    .catch(error => {
      console.log(error);
      response.render("error", { message: "Erro ao recuperar usuário", error });
    });
});

router.get('/new', (request, response, next) => {
  response.render('user', { title: 'Novo Usuário', user: {} });
});

router.get('/:page?', async (request, response, next) => {
  const page = parseInt(request.params.page);

  try {
    const qty = await db.countUsers();
    const pagesQty = Math.ceil(qty / db.PAGE_SIZE);
    const users = await db.findUsersPerPage(page);
        console.log(users);
        response.render('users', { title: 'Lista de Usuários', users, qty, pagesQty, page });
  }
  catch(error) {
      console.log(error);
      response.render("error", { message: "Erro ao listar usuários", error });
  };
});

module.exports = router;
