var express = require('express');
var router = express.Router();
const url = "https://didactic-palm-tree-r9jx5qwwjx72p677-4000.app.github.dev/pets/"


/* GET pets listing. */
router.get('/', function(req, res, next) {

  fetch(url, {method: 'GET'})
  .then(async (res)=>{
    if(!res.ok){
        const err = await res.json()
        throw err
    }
    return res.json()
  })
  .then((pets)=>{
    console.log('get')
    let title = "Gestão de pets"
    let cols = ["Id", "Nome", "Raça", "Cor", "Sexo", "Açôes"]
    res.render('layout', { body: 'pages/pets', title, pets, cols, error: "" });
  })
  .catch((error)=>{
    console.log('Erro: ', error)
    res.render('layout', { body: 'pages/pets', title, error });
  })
  
});


router.post("/", (req, res) => {
  const { name, race, colour, gender } = req.body
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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


router.put("/:id", (req, res)=>{
  const { id } = req.params
  const { name, race, clour, gender } = req.body
  fetch(url+id, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, race, clour, gender })
  })
  .then(async (res)=>{
    if(!res.ok){
        const err = await res.json()
        throw err
    }
    return res.json()
  })
  .then((pet)=>{
    res.send(pet);
  })
  .catch((error)=>{
    res.status(500).send(error);
  })
})


router.delete("/:id", (req, res)=>{
  const { id } = req.params
  fetch(url+id, {
    method: "DELETE"
  })
  .then(async (res)=>{
    if(!res.ok){
        const err = await res.json()
        throw err
    }
    return res.json()
  })
  .then((pet)=>{
    res.send(pet);
  })
  .catch((error)=>{
    res.status(500).send(error);
  })
})


router.get("/:id", (req, res) => {
  const { id } = req.params
  fetch(url+id, {
    method: "GET"
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
