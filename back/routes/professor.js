var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database/database.db')

// CRIANDO TABELA professor
db.run(`CREATE TABLE IF NOT EXISTS professor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT UNIQUE,
  materiaProf TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela professor: ', err);
  } else {
    console.log('Tabela professor criada com sucesso!');
  }
});

/* POST create a new professor. */
router.post('/register', (req, res) => {
  console.log(req.body)
  const { username, password, email, materiaProf } = req.body

  db.get('SELECT * FROM professor WHERE username = ?', username, (err, row) => {
    if (err) {
      console.log("Erro ao buscar professor", err)
      return res.status(500).send({ error: 'Erro ao buscar professor' })
    }
    if (row) {
      console.log("Professor já existe")
      return res.status(400).send({ error: 'Nome de professor já existe' })
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log("Erro ao criar o hash da senha", err)
          return res.status(500).send({ error: 'Erro ao criar o hash da senha' })
        } else {
          db.run('INSERT INTO professor (username, password, email, materiaProf) VALUES (?,?,?,?)', [username, hash, email, materiaProf], (err) => {
            if (err) {
              console.log("Erro ao criar o professor", err)
              return res.status(500).send({ error: 'Erro ao criar o professor' })
            } else {
              res.status(201).send({ message: "Professor criado com sucesso" })
            }
          })
        }
      })
    }
  })
})

/* GET professor listing. */
router.get('/', function (req, res, next) {
  db.all('SELECT * FROM professor', (err, professors) => {
    if (err) {
      console.log("Professores não foram encontrados", err)
      return res.status(500).send({ error: "Professores não encontrados" })
    } else {
      res.status(200).send(professors)
    }
  })
});

/* GET single professor by ID. */
router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM professor WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Professor não encontrado', err);
      return res.status(500).json({ error: 'Professor não encontrado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    res.status(200).json(row);
  });
});

/* PUT update a professor. */
router.put('/:id', function (req, res, next) {
  const { id } = req.params;
  const { username, password, email, materiaProf } = req.body;
  db.run('UPDATE professor SET username = ?, password = ?, email = ?, materiaProf = ? WHERE id = ?', [username, password, email, materiaProf, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o professor', err);
      return res.status(500).json({ error: 'Erro ao atualizar o professor' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    res.status(200).json({ message: "Professor atualizado com sucesso" });
  });
});

/* PATCH partially update a professor. */
router.patch('/:id', function (req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE professor SET ${setClause} WHERE id = ?`, [...values, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o professor parcialmente', err);
      return res.status(500).json({ error: 'Erro ao atualizar o professor parcialmente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    res.status(200).json({ message: "Professor atualizado parcialmente com sucesso" });
  });
});

/* DELETE a professor. */
router.delete('/:id', function (req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM professor WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Erro ao deletar o professor', err);
      return res.status(500).json({ error: 'Erro ao deletar o professor' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    res.status(200).json({ message: "Professor deletado com sucesso" });
  });
});

module.exports = router;
