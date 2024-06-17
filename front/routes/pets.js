var express = require('express');
var router = express.Router();
const url = "https://upgraded-spoon-x547w765gvgfpgxq-4000.app.github.dev/pets/"


// /* GET pets listing. */
router.get('/', function (req, res, next) {
  let title = "Gestão de pets"
  let cols = ["Id", "Nome", "Raça", "Cor", "Sexo", "Açôes"]

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
    .then((pets) => {
      console.log('get')
      res.render('layout', { body: 'pages/pets', title, pets, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro: ', error)
     res.redirect('/login')
    })
  
});

// POST NEW PET
router.post("/", (req, res) => {
  const { name, race, colour, gender } = req.body
  const token = req.session.token || ""
  fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, race, colour, gender })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pet) => {
      res.send(pet)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})


// UPDATE PET
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { name, race, colour, gender } = req.body
  const token = req.session.token || ""
  fetch(url + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json", 
      'Authorization': `Bearer ${token}`


    },

    body: JSON.stringify({ name, race, colour, gender })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((pet) => {
      res.send(pet);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

// REMOVE PET
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
    .then((pet) => {
      res.send(pet);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

// GET PET BY ID
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
    .then((pet) => {
      res.send(pet)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;




