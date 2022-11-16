const createNotes = `CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR,
  description VARCHAR,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
// user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
// Se eu deletar o user a que esta nota está vinculada automaticamente eu deleto a nota
module.exports = { createNotes } ;