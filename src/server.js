require('express-async-errors')
const AppError = require("./utils/AppError");

/* --------------------------- */

/* SRC/DATABASE/SQLITE/MIGRATIONS */
// Executa o index de migrations
const migrationsRun = require('./database/sqlite/migrations');
migrationsRun();

/* --------------------------- */


const express = require('express');
const routes = require('./routes')

const app = express();
app.use(express.json()); // app use o express no formato json

/* A responsabilidade de conhecer as rotas do usuario é o users.routes */
app.use(routes) // As rotas estão aqui

app.use((error, req, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(err)

  return response.status(500).json({
    status: "error",
    message: "Interval server error",
  });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
})