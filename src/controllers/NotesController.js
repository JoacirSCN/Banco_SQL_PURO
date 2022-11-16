const { sqliteConnection } = require('../database/sqlite');

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const { user_id } = request.params;

    const database = await sqliteConnection();

    const note_id = await database.run('INSERT INTO notes (title, description, user_id) VALUES (?,?,?)',
    [title, description, user_id]);

    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    });

    console.log(linksInsert);

    await database.run(`INSERT INTO links (${linksInsert}) VALUES (?,?,?)`);

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    });

    await database.run(`INSERT INTO tags (${tagsInsert}) VALUES (?,?,?)`);

    response.json();
  }
}

module.exports = NotesController;
