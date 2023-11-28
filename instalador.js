// Importe seus modelos do Sequelize
const Atletas = require('./ateltas/Atletas');
const Dan = require('./dan/Dan');

// Função para criar dados fictícios
async function instalarDados() {
  try {
    // Criação de atletas fictícios
    const atletasCriados = await Atletas.bulkCreate([
      {
        nome: 'Atleta 1',
        email: 'atleta1@email.com',
        senha: 'senha123',
      },
      {
        nome: 'Atleta 2',
        email: 'atleta2@email.com',
        senha: 'senha456',
      },
      // Adicione mais objetos conforme necessário
    ]);

    // Criação de dans fictícios
    const dansCriados = await Dan.bulkCreate([
      {
        nome: 'Dan 1',
      },
      {
        nome: 'Dan 2',
      },
      // Adicione mais objetos conforme necessário
    ]);

    console.log('Dados fictícios criados:', atletasCriados, dansCriados);
  } catch (error) {
    console.error('Erro ao criar dados fictícios:', error);
  }
}

module.exports = instalarDados;
