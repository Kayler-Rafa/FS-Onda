var express = require('express');
var router = express.Router();
const url = "https://cuddly-space-yodel-56w97j59qv4c766q-4001.app.github.dev/professor/"


/* GET professor listing. */
router.get('/', function(req, res, next) {

  fetch(url,{method: 'GET'})
  .then(async (res)=>{
    if(!res.ok){
        const err = await res.json()
        throw err
    }
    return res.json()
  })
  .then((professor)=>{
    console.log('get')
    let title = "Gestão de professor"
    let cols = ["Id", "Nome", "Senha", "Email", "Materia", "Açôes"]
    res.render('layout', {body: 'pages/professor', title, professor, cols, error: ""});
  })
  .catch((error)=>{
    console.log('Erro: ', error)
    res.render('layout', {body: 'pages/professor', title: "Gestão de professor", error});
  })
  
});


router.post("/", (req, res) => {
  const { username, password, email, phone } = req.body
  fetch(url + '/register', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, phone })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})


router.put("/:id", (req, res)=>{
  const { id } = req.params
  const { username, password, email, phone } = req.body
  fetch(url+id, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password, email, phone })
  })
  .then(async (res)=>{
    if(!res.ok){
        const err = await res.json()
        throw err
    }
    return res.json()
  })
  .then((user)=>{
    res.send(user);
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
  .then((user)=>{
    res.send(user);
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
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;
