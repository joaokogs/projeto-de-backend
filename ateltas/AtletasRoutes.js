const express = require('express');
const router = express.Router();
const Atletas = require('./Atletas');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    const criarNovoAtleta = await Atletas.create({
      nome,
      email,
      senha: hashSenha,
      danId: danId
    });

    res.status(201).json({ mensagem: 'Atleta cadastrado com sucesso!', atleta: criarNovoAtleta });
  } catch (error) {
    console.error('Erro ao criar atleta:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

router.post('/atleta/login', async (req, res) => {
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

    const token = jwt.sign({ id: atleta.id, email: atleta.email, userType: 'atleta' }, 'seuSegredo', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

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

router.get('/atleta', verifyToken, async (req, res) => {
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

// Rota para o atleta atualizar suas informações
router.put('/atleta/atualizar-info', verifyToken, async (req, res) => {
  try {
    const { nome, email, senha, danId } = req.body;
    const atletaId = req.atletaId; // ID do atleta logado

    // Encontra o atleta pelo ID
    const atleta = await Atletas.findByPk(atletaId);

    if (!atleta) {
      return res.status(404).json({ erro: 'Atleta não encontrado' });
    }

    // Atualiza as informações (nome, email, senha e danId)
    if (nome) {
      atleta.nome = nome;
    }

    if (email) {
      atleta.email = email;
    }

    if (senha) {
      const hashSenha = await bcrypt.hash(senha, 10);
      atleta.senha = hashSenha;
    }

    if (danId) {
      atleta.danId = danId;
    }

    // Salva as alterações no atleta
    await atleta.save();

    res.status(200).json({ mensagem: 'Informações do atleta atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar informações do atleta:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});
  
module.exports = router;
