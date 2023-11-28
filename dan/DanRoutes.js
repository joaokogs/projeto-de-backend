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
  
module.exports = router;