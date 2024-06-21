var express = require('express');
var router = express.Router();

const url = "https://automatic-halibut-w4p9xrj9wr4hgvxq-4000.app.github.dev/professores/";

// /* GET professores listing. */
router.get('/', function (req, res, next) {
  let title = "Gestão de professores";
  let cols = ["Id", "Username", "Password", "Email", "CPF", "Matéria do Professor", "Ações"];

  const token = req.session.token || "";

  fetch(url, { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }) 
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return response.json();
    })
    .then((professores) => {
      console.log('get');
      res.render('layout', { body: 'pages/professores', title, professores, cols, error: "" });
    })
    .catch((error) => {
      console.error('Erro ao listar professores:', error);
      res.redirect('/login');
    });
});

// POST NEW PROFESSOR
router.post("/", (req, res) => {
  const { username, password, email, cpf, materia_prof } = req.body;
  const token = req.session.token || "";

  fetch(url + '/register', {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ username, password, email, cpf, materia_prof })
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return response.json();
    })
    .then((professor) => {
      res.send(professor);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
})

// UPDATE PROFESSOR
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { username, password, email, cpf, materia_prof } = req.body;
  const token = req.session.token || "";

  fetch(url + id, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ username, password, email, cpf, materia_prof })
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return response.json();
    })
    .then((professor) => {
      res.send(professor);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
})

// REMOVE PROFESSOR
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const token = req.session.token || "";

  fetch(url + id, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return response.json();
    })
    .then((professor) => {
      res.send(professor);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
})

// GET PROFESSOR BY ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const token = req.session.token || "";

  fetch(url + id, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    } 
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return response.json();
    })
    .then((professor) => {
      res.send(professor);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
})

module.exports = router;
