const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./checklist.db');

db.run(`
CREATE TABLE IF NOT EXISTS registros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT,
  turma TEXT,
  data TEXT,
  status TEXT,
  motivo TEXT
)
`);

app.post('/salvar', (req, res) => {
  const { usuario, turma, data, status, motivo } = req.body;

  db.run(
    `INSERT INTO registros (usuario, turma, data, status, motivo)
     VALUES (?, ?, ?, ?, ?)`,
    [usuario, turma, data, status, motivo],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send({ ok: true });
    }
  );
});

app.get('/dashboard', (req, res) => {
  db.all(`
    SELECT turma, status, COUNT(*) as total 
    FROM registros 
    GROUP BY turma, status
  `, [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando'));
