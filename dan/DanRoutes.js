const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const Dan = require('./Dan');

//lista todos os dans ==> dan?page=2

  router.get('/', async (req, res) => {
    // #swagger.summary = "Lista todos os Dans (apenas 5 por página)"
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

// Retorna qual o Dan com mair número de reprovados --> lógica de negócios
  router.get('/mais-reprovados', async (req, res) => {
     // #swagger.summary = "Retorna o nome do dan e a quantidade de reprovados do dan que tem o mair número de reprovados"

    const numReprovados = await Dan.max('reprovados');
  
    if (numReprovados) {
        const danComMaisReprovados = await Dan.findOne({
            where: {
                reprovados: numReprovados,
            },
        });
  
        if (danComMaisReprovados) {
            res.status(200).send({
                nome: danComMaisReprovados.nome,
                reprovados: danComMaisReprovados.reprovados,
            });
        } else {
            res.status(404).send({
                message: 'Não foi encontrado nenhum dan com reprovados.',
            });
        }
    } else {
        res.status(404).send({
            message: 'Não foi encontrado nenhum dan com reprovados.',
        });
    }
  });
  
  
module.exports = router;