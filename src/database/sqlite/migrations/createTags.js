 const createTags = `CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR NOT NULL
)`;
//note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE
// Se eu deletar a nota em que a tag esta vinculada automaticamente eu deleto a tag
//user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
// Se eu deletar o user a que esta tag está vinculada automaticamente eu deleto a tag

module.exports = { createTags } ;