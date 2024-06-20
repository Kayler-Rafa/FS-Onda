var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")
var verifyJWT = require('../auth/verify-token');

const db = new sqlite3.Database('./database/database.db')

// CRIANDO TABELA professor
db.run(`CREATE TABLE IF NOT EXISTS professor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  email TEXT UNIQUE,
  materia_prof TEXT,
  cpf TEXT UNIQUE
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela professor: ', err);
  } else {
    console.log('Tabela professor criada com sucesso!');
  }
});

/* POST create a new professor. */
router.post('/', verifyJWT, (req, res) => {
  console.log(req.body)
  const { username, email, materia_prof, cpf } = req.body
  db.run('INSERT INTO professor (username, email, materia_prof, , cpf) VALUES (?,?,?,?)', [username, email, materia_prof, cpf], (err) => {
    if (err) {
      console.log("Erro ao criar o professor", err)
      return res.status(500).send({error: 'Erro ao criar o professor'})
    } else {
      res.status(201).send({message: "professor criado com sucesso"})
    }
  })
})

/* GET professor listing. */
router.get('/', verifyJWT, function(req, res, next) {
  db.all('SELECT * FROM professor', (err, professor) => {
    if (err) {
      console.log("professor não foram encontrados", err)
      return res.status(500).send({error: "professor não encontrados"})
    } else {
      res.status(200).send(professor)
    }
  })
});

/* GET single professor by ID. */
router.get('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM professor WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('professor não encontrado', err);
      return res.status(500).json({error: 'professor não encontrado'});
    }
    if (!row) {
      return res.status(404).json({error: 'professor não encontrado'});
    }
    res.status(200).json(row);
  });
});

/* PUT update a professor. */
router.put('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  const { username, email, materia_prof, cpf } = req.body;
  db.run('UPDATE professor SET username = ?, email = ?, materia_prof = ?, cpf = ?, WHERE id = ?', [username, email, materia_prof, , cpf, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o professor', err);
      return res.status(500).json({error: 'Erro ao atualizar o professor'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'professor não encontrado'});
    }
    res.status(200).json({message: "professor atualizado com sucesso"});
  });
});

/* PATCH partially update a professor. */
router.patch('/:id', function(req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({error: 'Nenhum campo fornecido para atualização'});
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE professor SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o professor parcialmente', err);
      return res.status(500).json({error: 'Erro ao atualizar o professor parcialmente'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'professor não encontrado'});
    }
    res.status(200).json({message: "professor atualizado parcialmente com sucesso"});
  });
});

/* DELETE a professor. */
router.delete('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM professor WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erro ao deletar o professor', err);
      return res.status(500).json({error: 'Erro ao deletar o professor'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'professor não encontrado'});
    }
    res.status(200).json({message: "professor deletado com sucesso"});
  });
});

module.exports = router;