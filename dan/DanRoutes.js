const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const Dan = require('./Dan');


router.post("/dan", async (req, res) => {
    try {
      const {nome} = req.body;
  
      const danExistente = await Dan.findOne({
        where: {nome}
      });
  
      if (danExistente) {
        return res.status(400).json({ erro: 'Dan já cadastrado' });
      }
  
      const CriarNovoDan = await Dan.create({
        nome,
      });
  
      res.status(201).json({ mensagem: 'Dan cadastrado com sucesso!', dan: CriarNovoDan });
    } catch (error) {
      console.error('Erro ao criar dan:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });

//lista todos os dans ==> dan?page=2

  router.get('/dan', async (req, res) => {
    try {
      const page = req.query.page || 1; // Página atual, padrão é 1
      const perPage = 5; // Atletas por página
  
      const offset = (page - 1) * perPage; // Calcula o deslocamento (offset)
  
      const dans = await Dan.findAll({
        limit: perPage,
        offset: offset,
      });
  
      res.json(dans); // Retorna os atletas como resposta JSON
    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
      res.status(500).json({ error: 'Erro ao buscar atletas' });
    }
  });
  
module.exports = router;