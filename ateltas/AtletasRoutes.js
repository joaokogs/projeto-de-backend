const express = require('express');
const router = express.Router();
const Atletas = require('./Atletas');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

router.post("/atleta", async (req, res) => {
    try {
      const { nome, email, senha,danId } = req.body;
  
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
        senha: hashSenha,
        danId:danId
      });
  
      res.status(201).json({ mensagem: 'Atleta cadastrado com sucesso!', atleta: criarNovoAtleta });
    } catch (error) {
      console.error('Erro ao criar atleta:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });

//rota para listar todos os atletas ==> atletas?page=2

router.get('/atletas', async (req, res) => {
  try {
    const page = req.query.page || 1; // Página atual, padrão é 1
    const perPage = 5; // Atletas por página

    const offset = (page - 1) * perPage; // Calcula o deslocamento (offset)

    const atletas = await Atletas.findAll({
      limit: perPage,
      offset: offset,
    });

    res.json(atletas); // Retorna os atletas como resposta JSON
  } catch (error) {
    console.error('Erro ao buscar atletas:', error);
    res.status(500).json({ error: 'Erro ao buscar atletas' });
  }
});
  
module.exports = router;