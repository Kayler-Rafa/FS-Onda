var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")
var verifyJWT = require('../auth/verify-token');

const db = new sqlite3.Database('./database/database.db')

// CRIANDO TABELA PETS
db.run(`CREATE TABLE IF NOT EXISTS pets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  race TEXT,
  colour TEXT,
  gender TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela pets: ', err);
  } else {
    console.log('Tabela pets criada com sucesso!');
  }
});

/* POST create a new pet. */
router.post('/', verifyJWT, (req, res) => {
  console.log(req.body)
  const { name, race, colour, gender } = req.body
  db.run('INSERT INTO pets (name, race, colour, gender) VALUES (?,?,?,?)', [name, race, colour, gender], (err) => {
    if (err) {
      console.log("Erro ao criar o pet", err)
      return res.status(500).send({error: 'Erro ao criar o pet'})
    } else {
      res.status(201).send({message: "Pet criado com sucesso"})
    }
  })
})

/* GET pets listing. */
router.get('/', verifyJWT, function(req, res, next) {
  db.all('SELECT * FROM pets', (err, pets) => {
    if (err) {
      console.log("Pets não foram encontrados", err)
      return res.status(500).send({error: "Pets não encontrados"})
    } else {
      res.status(200).send(pets)
    }
  })
});

/* GET single pet by ID. */
router.get('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM pets WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Pet não encontrado', err);
      return res.status(500).json({error: 'Pet não encontrado'});
    }
    if (!row) {
      return res.status(404).json({error: 'Pet não encontrado'});
    }
    res.status(200).json(row);
  });
});

/* PUT update a pet. */
router.put('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  const { name, race, colour, gender } = req.body;
  db.run('UPDATE pets SET name = ?, race = ?, colour = ?, gender = ? WHERE id = ?', [name, race, colour, gender, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o pet', err);
      return res.status(500).json({error: 'Erro ao atualizar o pet'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'Pet não encontrado'});
    }
    res.status(200).json({message: "Pet atualizado com sucesso"});
  });
});

/* PATCH partially update a pet. */
router.patch('/:id', function(req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({error: 'Nenhum campo fornecido para atualização'});
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE pets SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o pet parcialmente', err);
      return res.status(500).json({error: 'Erro ao atualizar o pet parcialmente'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'Pet não encontrado'});
    }
    res.status(200).json({message: "Pet atualizado parcialmente com sucesso"});
  });
});

/* DELETE a pet. */
router.delete('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM pets WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erro ao deletar o pet', err);
      return res.status(500).json({error: 'Erro ao deletar o pet'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'Pet não encontrado'});
    }
    res.status(200).json({message: "Pet deletado com sucesso"});
  });
});

module.exports = router;