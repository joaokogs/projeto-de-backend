const express = require('express');
const router = express.Router();
const Atletas = require('./Atletas');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

router.post("/atleta", async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
  
      const atletaExistente = await Atletas.findOne({
        where: {
          [Op.or]: [
            { nome },
            { email }
          ]
        }
      });
  
      if (atletaExistente) {
        return res.status(400).json({ erro: 'Nome ou Email já estão cadastrados' });
      }
  
      const hashSenha = await bcrypt.hash(senha, 10);
  
      const criarNovoAtleta = await Atletas.create({
        nome,
        email,
        senha: hashSenha
      });
  
      res.status(201).json({ mensagem: 'Atleta cadastrado com sucesso!', atleta: criarNovoAtleta });
    } catch (error) {
      console.error('Erro ao criar atleta:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });
  
module.exports = router;