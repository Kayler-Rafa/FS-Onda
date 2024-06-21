var express = require('express');
var router = express.Router();
const url = "https://cuddly-space-yodel-56w97j59qv4c766q-4001.app.github.dev/aluno/"


// /* GET aluno listing. */
router.get('/', function (req, res, next) {
  let title = "Gestão de aluno"
  let cols = ["Id", "Nome", "Email", "Cpf", "Nivel do Aluno", "Açôes"]

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
    .then((aluno) => {
      console.log('get')
      res.render('layout', { body: 'pages/aluno', title, aluno, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro: ', error)
     res.redirect('/login')
    })
  
});

// POST NEW aluno
router.post("/", (req, res) => {
  const { name, email, cpf, nvl_aluno } = req.body
  const token = req.session.token || ""
  fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, email, cpf, nvl_aluno })
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


// UPDATE aluno
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { name, email, cpf, nvl_aluno } = req.body
  const token = req.session.token || ""
  fetch(url + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json", 
      'Authorization': `Bearer ${token}`


    },

    body: JSON.stringify({ name, email, cpf, nvl_aluno })
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

// REMOVE aluno
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

// GET aluno BY ID
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




