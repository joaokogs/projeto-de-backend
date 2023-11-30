const Atletas = require('./ateltas/Atletas');
const Dan = require('./dan/Dan');
const Admin = require('./admin/Admin')
const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router();

router.get('/install', async (req, res) => {
  try {
    // Dados fictícios para administradores
    const adminData = [
      { user: 'admin1', senha: 'senha123' },
      { user: 'admin2', senha: 'senha456' }
      // Adicione mais objetos conforme necessário
    ];

    // Inserindo administradores fictícios
    for (const admin of adminData) {
      const hashSenha = await bcrypt.hash(admin.senha, 10);
      await Admin.create({
        user: admin.user,
        senha: hashSenha
      });
    }

    // Dados fictícios para atletas
    const atletaData = [
      { nome: 'Atleta 1', email: 'atleta1@email.com', senha: 'senha123', danId: 1 },
      { nome: 'Atleta 2', email: 'atleta2@email.com', senha: 'senha456', danId: 2 }
      // Adicione mais objetos conforme necessário
    ];

    // Inserindo atletas fictícios
    for (const atleta of atletaData) {
      const hashSenha = await bcrypt.hash(atleta.senha, 10);
      await Atletas.create({
        nome: atleta.nome,
        email: atleta.email,
        senha: hashSenha,
        danId: atleta.danId
      });
    }

    const dansData =[
      {nome:'1º Kyo'},
      {nome:'1º Dan'},
      {nome:'2º Dan'},
      {nome:'3º Dan'},
      {nome:'4º Dan'},
      {nome:'5º Dan'},
      {nome:'6º Dan'},
      {nome:'7º Dan'}
    
    ]

    for(const dan of dansData){
      await Dan.create({
        nome: dan.nome
      });
    }

    res.status(201).json({ message: 'Dados fictícios instalados com sucesso!' });
  } catch (error) {
    console.error('Erro ao instalar dados fictícios:', error);
    res.status(500).json({ error: 'Erro ao instalar dados fictícios' });
  }
});

module.exports = router;


