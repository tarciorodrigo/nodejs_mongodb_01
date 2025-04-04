const express = require('express');
const router = express.Router();
const db = require("../db");

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
    return response.redirect("/customers/new?error=O campo nome é obrigatório");

  if (request.body.idade && !/[0-9]+/.test(request.body.idade))
    return response.redirect("/customers/new?error=Campo idade deve ser númerico");

  if (request.body.cpf && !/[0-9]+/.test(request.body.cpf))
    return response.redirect("/customers/new?error=Campo CPF deve ser númerico");

  const id = request.body.id;
  const nome = request.body.nome;
  const cpf = request.body.cpf;
  const idade = parseInt(request.body.idade);
  //const cidade = request.body.cidade;
  const cidade = request.body.cidade.trim().toUpperCase() == "SELECIONE O ESTADO" ? '' : request.body.cidade;
  const uf = request.body.uf.length > 2 ? '' : request.body.uf;

  const customer = { nome, cpf, idade, cidade, uf };
  const promise = id
                ? db.updateCustomer(id, customer)
                : db.insertCustomer(customer)

  promise
    .then(result => {
      response.redirect("/customers");
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
      response.redirect("/customers");
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
      response.render('customer', { title: 'Editar Cliente', customer });
    })
    .catch(error => {
      console.log(error);
      response.render("error", { message: "Erro ao recuperar cliente", error });
    });
});

router.get('/new', (request, response, next) => {
  response.render('customer', { title: 'Novo Cliente', customer: {} });
});

router.get('/:page?', async (request, response, next) => {
  const page = parseInt(request.params.page);

  try {
    const qty = await db.countCustomers();
    const pagesQty = Math.ceil(qty / db.PAGE_SIZE);
    const customers = await db.findCustomersPerPage(page);
        console.log(customers);
        response.render('customers', { title: 'Lista de Clientes', customers, qty, pagesQty, page });
  }
  catch(error) {
      console.log(error);
      response.render("error", { message: "Erro ao listar cliente", error });
  };
});

module.exports = router;
