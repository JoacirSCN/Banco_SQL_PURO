// A missão desse index é reunir todas as rotas da minha aplicação
const { Router } = require('express');

const usersRoutes = require('./users.routes');
const notesRoutes = require('./notes.routes');
const tagsRoutes = require('./tags.routes');


const routes = Router();
// Opa é o /users que eu quero acessar, então me leva para o arquivo usersRoutes(rotas do usuário)
routes.use('/users', usersRoutes);
routes.use('/notes', notesRoutes);
routes.use('/tags', tagsRoutes);



module.exports = routes;