var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var verifyJWT = require('../auth/verify-token');
var bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database/database.db')

// CRIAR DB
db.run(`CREATE TABLE IF NOT EXISTS professores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT UNIQUE,
  cpf TEXT UNIQUE,
  materia_prof TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela professores: ', err);
  } else {
    console.log('Tabela professores criada com sucesso!');
  }
});

// POST USER
router.post('/register', verifyJWT, (req, res, next)=>{
  console.log(req.body)
  const { username, password, email, cpf, materia_prof } = req.body
  
  db.get('SELECT * FROM professores WHERE username = ?', username, (err, row) => {
  if (row) {
    console.log("professor ja existe", err)
    return res.status(400).send({ error: 'professor já existe' })
  }else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log("erro ao criar hash da senha", err)
        return res.status(500).send({ error: 'Erro ao criar hash da senha' })
      } else {
        db.run('INSERT INTO professores (username, password, email, cpf, materia_prof) VALUES (?,?,?,?,?)', [username, hash, email, cpf, materia_prof], (err)=>{
          if (err) {
            console.log("Erro ao criar user: ", err)
            return res.status(500).send({ error: 'Erro ao criar user' })
          } else {
            res.status(201).send({ message: "User criado com sucesso" })
          }
        })
      }
    }) 
  }
})
})

// GET USER 
router.get('/', verifyJWT, function(req, res, next) {
  db.all('SELECT * FROM professores', (err, professores) => {
    if(err){
      console.log("professores não encontrados ", err)
      return res.status(500).send({error: "professores não encontrados"})
    } else {
      res.status(200).send(professores)
    }
  })
})

// GET USER BY ID
router.get('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM professores WHERE id = ?', [id], (err, row) => {
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


// PUT USER
router.put('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  const { username, password, email, cpf, materia_prof} = req.body
  db.run('UPDATE professores SET username = ?, password = ?, email = ?, cpf = ?, materia_prof = ? WHERE id = ?', [username, password, email, cpf, materia_prof, id], (err) => {
    if(err){
      console.log("User não encontrados ", err)
      return res.status(500).send({error: "Erro ao atualizar user"})
    }
    if(this.changes === 0) {
      return res.status(404).send({error: "User não encontrados"})
    }
      res.status(200).json({message: "User atualizado com sucesso"})
  });
});

// PATCH USER - vou ficar dedvendo o patch
router.patch('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({error: 'Nenhum campo fornecido para atualização'});
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE professores SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o professores parcialmente', err);
      return res.status(500).json({error: 'Erro ao atualizar o professores parcialmente'});
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'professor não encontrado'});
    }
    res.status(200).json({message: "professor atualizado parcialmente com sucesso"});
  });
});

// DELETE USER
router.delete('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  db.run('DELETE FROM professores WHERE id = ?', [id], function(err) {
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
