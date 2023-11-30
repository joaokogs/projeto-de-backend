const express = require('express');
const router = express.Router();
const Atletas = require('./Atletas');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rota para criar um novo atleta
router.post("/atleta", async (req, res) => {
  try {
    const { nome, email, senha, danId } = req.body;

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

    const novoAtleta = await Atletas.create({
      nome,
      email,
      senha: hashSenha,
      danId
    });

    res.status(201).json({ mensagem: 'Atleta cadastrado com sucesso!', atleta: novoAtleta });
  } catch (error) {
    console.error('Erro ao criar atleta:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Rota para fazer login e gerar token JWT
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const atleta = await Atletas.findOne({ where: { email } });

    if (!atleta) {
      return res.status(404).json({ erro: 'Atleta não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, atleta.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: atleta.id, email: atleta.email }, 'seuSegredo', { expiresIn: '30s' });

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Middleware para verificar o token JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token.split(' ')[1], 'seuSegredo', (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Falha na autenticação do token' });
    }

    req.atletaId = decoded.id;
    next();
  });
}

// Rota protegida para listar todos os atletas, requer autenticação
router.get('/atletas', verifyToken, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = 5;
    const offset = (page - 1) * perPage;

    const atletas = await Atletas.findAll({
      limit: perPage,
      offset: offset,
    });

    res.json(atletas);
  } catch (error) {
    console.error('Erro ao buscar atletas:', error);
    res.status(500).json({ error: 'Erro ao buscar atletas' });
  }
});

module.exports = router;
