const express = require('express');
const router = express.Router();
const Admin = require('./Admin');
const bcrypt = require('bcryptjs');

router.post("/admin", async (req, res) => {
  try {
    const { user, senha } = req.body;

    const adminExistente = await Admin.findOne({
      where: { user }
    });

    if (adminExistente) {
      return res.status(400).json({ erro: 'O admin já está cadastrado' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const criarNovoAdmin = await Admin.create({
      user,
      senha: hashSenha
    });

    res.status(201).json({ mensagem: 'Admin cadastrado com sucesso!', admin: criarNovoAdmin });
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

  
router.get('/admin', async (req, res) => {
  try {
    const page = req.query.page || 1; // Página atual, padrão é 1
    const perPage = 5; // Atletas por página

    const offset = (page - 1) * perPage; // Calcula o deslocamento (offset)

    const admins = await Admin.findAll({
      limit: perPage,
      offset: offset,
    });

    res.json(admins); // Retorna os atletas como resposta JSON
  } catch (error) {
    console.error('Erro ao buscar atletas:', error);
    res.status(500).json({ error: 'Erro ao buscar atletas' });
  }
});
  
module.exports = router;