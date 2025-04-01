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
  if (!request.body.nome)
    return response.redirect("/new?error=O campo nome é obrigatório");

  if (request.body.idade && !/[0-9]+/.test(request.body.idade))
    return response.redirect("/new?error=Campo idade deve ser númerico");

  const id = request.body.id;
  const nome = request.body.nome;
  const idade = parseInt(request.body.idade);
  const cidade = request.body.cidade;
  const uf = request.body.uf.length > 2 ? '' : request.body.uf;

  const customer = { nome, idade, cidade, uf };
  const promise = id
                ? db.updateCustomer(id, customer)
                : db.insertCustomer(customer)

  promise
    .then(result => {
      response.redirect("/");
    })
    .catch(error => {
      console.log(error);      
      response.render("error", { message: "Erro ao salvar cleinte", error });
    })
});

router.get('/delete/:customerId', (request, response) => {
  const id = request.params.customerId;
  db.deleteCustomer(id)
    .then(result => {
      response.redirect("/");
    })
    .catch(error => {
      console.log(error);
      response.render("error", { message: "Erro ao excluir cliente", error });
    });  
});

router.get("/edit/:customerId", (request, response) => {
  const id = request.params.customerId;
  db.findCustomer(id)
    .then(customer => {
      console.log(customer);
      response.render('customers', { title: 'Editar Cliente', customer });
    })
    .catch(error => {
      console.log(error);
      response.render("error", { message: "Erro ao recuperar cliente", error });
    });
});

router.get('/new', (request, response, next) => {
  response.render('customers', { title: 'Novo Cliente', customer: {} });
});

router.get('/', (request, response, next) => {
  db.findCustomers()
    .then(customers => {
      console.log(customers);
      response.render('index', { title: 'Lista de Clientes', customers });
    })
    .catch(error => {
      console.log(error);
      response.render("error", { message: "Erro ao listar cliente", error });
    });
});

module.exports = router;
