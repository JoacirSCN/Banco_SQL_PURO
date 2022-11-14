const sqliteConnection = require('../../sqlite'); 

const createUsers = require('./createUsers');
const createNotes = require('./createNotes');

async function migrationsRun() {
  // Schemas vai receber todas as migrations e vai juntar elas
  const schemas = [
    createUsers,
    createNotes
  ].join('');

  sqliteConnection()
    .then( (db) => {db.exec(schemas)})
    .catch( (error) => console.error(error) );
}

module.exports = migrationsRun; // Vai ser recebido no server.js