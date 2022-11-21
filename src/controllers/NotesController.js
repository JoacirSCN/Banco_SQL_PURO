const { sqliteConnection } = require("../database/sqlite");
const AppError = require('../utils/AppError')

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const { user_id } = request.params;
    const database = await sqliteConnection();

    const note_id = await database.run(
      "INSERT INTO notes (title, description, user_id) VALUES (?,?,?)",
      [title, description, user_id]
    );

    tags.forEach(async (tag) => {
      await database.run(
        "INSERT INTO tags (note_id, user_id, name) VALUES (?,?,?)",
        [note_id.lastID, user_id, tag]
      );
    });

    links.forEach(async (link) => {
      await database.run("INSERT INTO links (url, note_id) VALUES (?,?)", [
        link,
        note_id.lastID,
      ]);
    });

    response.status(201).json();
  }

  async show(request, response) {
    const { id } = request.params;
    const database = await sqliteConnection();

    const note = await database.get("SELECT * FROM notes WHERE id = (?)", [id]);
    const tags = await database.all("SELECT * FROM tags ORDER BY name");
    const links = await database.all("SELECT * FROM links ORDER BY created_at");

    return response.json({
      ...note,
      tags,
      links,
    });
  }

  async delete(request, response) {
    const { id } = request.params;
    const database = await sqliteConnection();

    await database.run("DELETE FROM notes WHERE id = (?)", [id]);

    return response.json();
  }

  async index(request, response) {
    const { title, user_id, tags } = request.query;
    const database = await sqliteConnection();
    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());
      let filterTagsString = "";

      filterTags.forEach((tag) => {
        filterTagsString += "'" + tag + "',";
      });

      filterTagsString = filterTagsString.slice(0, filterTagsString.length - 1);
      notes = await database.all(`
        SELECT notes.id, notes.title, notes.user_id
        FROM tags
        JOIN notes
        ON tags.note_id = notes.id
        WHERE name IN (${filterTagsString})
        AND tags.user_id = '${user_id}'
        AND notes.title LIKE '%${title}%'
        INTERSECT
        SELECT notes.id, notes.title, notes.user_id
        FROM tags
        JOIN notes
        ON tags.note_id = notes.id
        WHERE name IN (${filterTagsString})
        AND tags.user_id = '${user_id}'
        AND notes.title LIKE '%${title}%'
      `);

      if(!notes.length) throw new AppError('Não existem notas cadastradas')
        
    } else {
      notes = await database.all(
        `SELECT * FROM notes WHERE user_id = '${user_id}' 
        INTERSECT
        SELECT * FROM notes WHERE title LIKE '%${title}%'`
      );
    }


    const userTags = await database.all(`SELECT * FROM tags WHERE user_id = (?)`, [user_id]);

    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);
            
      return {
        ...note,
        tags: noteTags
      }
      
    });

    return response.json(notesWithTags);
  }
}

module.exports = NotesController;
