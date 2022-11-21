const { Router } = require('express');
const TagsController = require('../controllers/TagsController');
const tagsController = new TagsController();

const tagsRoutes = Router();

// é aqui que a rota do usuário está, userController.cria usuario
tagsRoutes.get('/:user_id', tagsController.index);


module.exports = tagsRoutes;