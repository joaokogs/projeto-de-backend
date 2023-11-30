// Importe seus modelos do Sequelize
const Atletas = require('./ateltas/Atletas');
const Dan = require('./dan/Dan');
const Admin = require('./admin/Admin')
const bcrypt = require('bcryptjs');



// Função para criar dados fictícios
async function instalarDados() {
  try {
    // Criação de atletas fictícios
    // const atletasCriados = await Atletas.bulkCreate([
      const senha = "senha123";
      const hashSenha = await bcrypt.hash(senha, 10);
    //   {
    //     nome: 'Atleta 1',
    //     email: 'atleta1@email.com',
    //     senha: 'senha123',
    //     danId: 1

    //   },
    //   {
    //     nome: 'Atleta 3',
    //     email: 'atleta32@email.com',
    //     senha: 'senha789',
    //     danId:4
    //   },
    //   {
    //     nome: 'Atleta 4',
    //     email: 'atleta42@email.com',
    //     senha: 'senha1011',
    //     danId:5
    //   },
    //   {
    //     nome: 'Atleta 5',
    //     email: 'atleta52@email.com',
    //     senha: 'senha1213',
    //     danId:6
    //   },
    //   {
    //     nome: 'Atleta 6',
    //     email: 'atleta62@email.com',
    //     senha: 'senha1415',
    //     danId:7
    //   },
    //   {
    //     nome: 'Atleta 7',
    //     email: 'atleta82@email.com',
    //     senha: 'senha1617',
    //     danId:8
    //   },
    //   // Adicione mais objetos conforme necessário
    // ]);

    // // Criação de dans fictícios
    // const dansCriados = await Dan.bulkCreate([
    //   {
    //     nome: '1º Kyu',
    //   },
    //   {
    //     nome: '1º Dan',
    //   },
    //   {
    //     nome: '2º Dan',
    //   },
    //   {
    //     nome: '3º Dan',
    //   },
    //   {
    //     nome: '4º Dan',
    //   },
    //   {
    //     nome: '5º Dan',
    //   },
    //   {
    //     nome: '6º Dan',
    //   },
    //   {
    //     nome: '7º Dan',
    //   },
    //   // Adicione mais objetos conforme necessário
    // ]);
    const adminsCriados = await Admin.bulkCreate([
      // {
      //   user: 'Jp222',
      //   senha: 'senha123'
      // }
      // {
      //   user:'thais',
      //   senha:'senha123'
      // }
      {
        user:'Pedro',
        senha: hashSenha
      }

    ])

    // console.log('Dados fictícios criados:', atletasCriados, dansCriados,adminsCriados);
  } catch (error) {
    console.error('Erro ao criar dados fictícios:', error);
  }
}

module.exports = instalarDados;
