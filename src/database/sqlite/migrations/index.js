const { sqliteConnection } = require('../../sqlite'); 

const { createUsers } = require('./createUsers');
const { createNotes } = require('./createNotes');

async function migrationsRun() {
  const database = await sqliteConnection();
  
  try {
    await database.exec(createUsers);
    await database.exec(createNotes);
  } catch(err) {
    console.log(err)
  }
}

module.exports = migrationsRun; // Vai ser recebido no server.js