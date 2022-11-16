const createLinks = `CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url VARCHAR NOT NULL,
  note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
// user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
// Se eu deletar o user a que esta nota está vinculada automaticamente eu deleto a nota
module.exports = { createLinks } ;