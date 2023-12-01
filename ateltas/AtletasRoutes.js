const express = require('express');
const router = express.Router();
const Atletas = require('./Atletas');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Dan = require('../dan/Dan');


//Rota para criar novo atleta
router.post("/", async (req, res) => {
  // #swagger.summary = "Cria um novo atleta"
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

//Rota para logar como atleta
router.post('/login', async (req, res) => {
  // #swagger.summary = "Realiza o login de um atleta"
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

//Função para verificar o token jwt de atleta
function tokenAtleta(req, res, next) {
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

// Rota para o atleta atualizar seus dados
router.put('/editar', tokenAtleta, async (req, res) => {
  // #swagger.summary = "Edita dados do atleta logado"
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


//Rota que mostra todos os atletas que tem um mesmo dan --> lógica de negocio
router.get('/dan/:id', async (req, res) => {
  // #swagger.summary = "Mostra todos os atletas que possuem o mesmo Dan"
  try {
    const danId = req.params.id;

    const atletasComDanId = await Atletas.findAll({
      where: {
        danId: danId
      },
      attributes: ['nome'],
      include: [{
        model: Dan,
        attributes: ['nome'],
        as: 'dan',
      }]
    });

    res.json(atletasComDanId);
  } catch (error) {
    console.error('Erro ao buscar atletas por ID de Dan:', error);
    res.status(500).json({ error: 'Erro ao buscar atletas por ID de Dan' });
  }
});

  
module.exports = router;
