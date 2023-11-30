const Atletas = require('./ateltas/Atletas');
const Dan = require('./dan/Dan');
const Admin = require('./admin/Admin')
const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router();

router.get('/install', async (req, res) => {
  try {
    const adminData = [
      { user: 'Jpyk', senha: 'senha123' },
    ];
    for (const admin of adminData) {
      const hashSenha = await bcrypt.hash(admin.senha, 10);
      await Admin.create({
        user: admin.user,
        senha: hashSenha
      });
    }
    const atletaData = [
      { nome: 'João Pedro', email: 'joao@gmail.com', senha: 'senha123', danId: 3 },
      { nome: 'Thais', email: 'thais@gmail.com', senha: 'senha123', danId: 2 },
      { nome: 'Matheus', email: 'matheus@gmail.com', senha: 'senha123', danId: 1 },
      { nome: 'Marcelo', email: 'marcelo@gmail.com', senha: 'senha123', danId: 4 },
      { nome: 'Wilson', email: 'wilson@gmail.com', senha: 'senha123', danId: 5 },
      { nome: 'Edson', email: 'edson@gmail.com', senha: 'senha123', danId: 6 },
      { nome: 'Lucas', email: 'lucas@gmail.com', senha: 'senha123', danId: 7 },
      { nome: 'Emi', email: 'emi@gmail.com', senha: 'senha123', danId: 8 },
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


