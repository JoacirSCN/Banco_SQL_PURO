const { hash, compare } = require('bcryptjs'); // Recebe a função de criptografia de senha
const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite'); // É a conecção com o banco de dados
const { use } = require('express/lib/router');

class UsersController {
  /** Pode ter no MAXIMO 5 METÓDOS
   * index - GET para listar vários registros.
   * show - GET para exibir um registro especifico.
   * create - POST para criar um registro.
   * update - PUT para atualizar um registro.
   * delete - DELETE para remover um registro.
   */

  async create(request, response) {
    const { name, email, password } = request.body;

    /* R - READ -> SELECT -> Ler dados */
    const database = await sqliteConnection();

      // Selecionar todos os usuarios onde o email é igual ao email do request.body
    const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])

    if(checkUserExists) {
      throw new AppError('Este e-mail já está em uso.');
    }
    /* ------------------------------ */

    /* Criptografando a senha do usuario */
    const hashadPassword = await hash(password, 8)
      // na função hash passo como parametro a senha e o fator de complexidade 
      // o await serve para que eu espere terminar de fazer a criptografia antes de recebe-la
    /* --------------------------------- */

    /* C - Create → INSERT→ Criar um registro  */
    await database.run('INSERT INTO users (name, email, password) VALUES (?,?,?)',
      [name, email, hashadPassword]
    );

    /* ------------------------------ */
    return response.status(201).json()
  }

  async update(request, response) {
    /* U - Update → UPDATE → Atualizar */
    const {name, email, password, old_password} = request.body;
    const {id} = request.params;
    
    const database = await sqliteConnection();
    const user = await database.get('SELECT * FROM users WHERE id = (?)',[id]);

    if(!user) {
      throw new AppError('Usuário não encontrado');
    }

    const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)',[email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha.");
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
      WHERE id = ?`,[
        user.name,
        user.email,
        user.password,
        id 
      ]
    );
    /* -------------------------------- */
    return response.status(200).json();
  }

}

module.exports = UsersController;