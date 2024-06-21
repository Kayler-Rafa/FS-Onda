var express = require('express');
var router = express.Router();
const url = "https://automatic-halibut-w4p9xrj9wr4hgvxq-4000.app.github.dev/aluno/"

// /* GET alunos listing. */
router.get('/', function (req, res, next) {
  let title = "Gestão de alunos"
  let cols = ["Id", "Username", "Password", "Email", "CPF", "Nível do Aluno", "Ações"]

  const token = req.session.token || ""

  fetch(url, { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    }
  }) 
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((alunos) => {
      console.log('get')
      res.render('layout', { body: 'pages/aluno', title, alunos, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro: ', error)
      res.redirect('/login')
    })
});

// POST NEW ALUNO
router.post("/", (req, res) => {
  const { username, password, email, cpf, nvl_aluno } = req.body
  const token = req.session.token || ""
  fetch(url+'/register', {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username, password, email, cpf, nvl_aluno })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((aluno) => {
      res.send(aluno)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE ALUNO
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { username, password, email, cpf, nvl_aluno } = req.body
  const token = req.session.token || ""
  fetch(url + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json", 
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username, password, email, cpf, nvl_aluno })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((aluno) => {
      res.send(aluno);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

// REMOVE ALUNO
router.delete("/:id", (req, res) => {
  const { id } = req.params
  const token = req.session.token || ""
  fetch(url + id, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    }
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((aluno) => {
      res.send(aluno);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

// GET ALUNO BY ID
router.get("/:id", (req, res) => {
  const { id } = req.params
  const token = req.session.token || ""
  fetch(url + id, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    } 
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((aluno) => {
      res.send(aluno)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;
