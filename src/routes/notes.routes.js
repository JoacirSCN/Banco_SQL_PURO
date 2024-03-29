const { Router } = require('express');
const NotesController  = require('../controllers/NotesController');
const notesController = new NotesController();

const notesRoutes = Router();

// é aqui que a rota do usuário está, userController.cria usuario
notesRoutes.post('/:user_id', notesController.create);
notesRoutes.get('/:id', notesController.show);
notesRoutes.delete('/:id', notesController.delete);
notesRoutes.get('/', notesController.index);





/* usersRoutes.post('/', (request, response) => {
 // Isso é responsabilidade do CONTROLLERS
  const { name, email, password } = request.body;
  response.json({ name, email, password }); 
}) */

module.exports = notesRoutes;