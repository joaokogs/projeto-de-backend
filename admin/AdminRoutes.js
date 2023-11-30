const express = require('express');
const router = express.Router();
const Admin = require('./Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Atletas = require('../ateltas/Atletas')

// Rota para criar um novo admin
router.post("/",verifyAdminToken, async (req, res) => {
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

// Rota para realizar login do admin
router.post('/login', async (req, res) => {
  try {
    const { user, senha } = req.body;

    const admin = await Admin.findOne({ where: { user } });

    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: admin.id, user: admin.user, userType: 'admin' }, 'seuSegredo', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Função para verificar o token JWT do admin
function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token.split(' ')[1], 'seuSegredo', (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Falha na autenticação do token' });
    }

    //verifica se o JWT é de um adm ou de um atleta
    if (decoded.userType !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado. Não é um admin.' });
    }

    req.adminId = decoded.id;
    next();
  });
}

// Rota para listar todos os admins, apenas 5 por pagina
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = 5;
    const offset = (page - 1) * perPage;

    const admins = await Admin.findAll({
      limit: perPage,
      offset: offset,
    });

    res.json(admins);
  } catch (error) {
    console.error('Erro ao buscar admins:', error);
    res.status(500).json({ error: 'Erro ao buscar admins' });
  }
});


// Rota para o admin excluir um atleta pelo email
router.delete('/excluir-atleta', verifyAdminToken, async (req, res) => {
  try {
    const { email } = req.body;

    // Encontra o atleta pelo email e o exclui
    const atleta = await Atletas.findOne({ where: { email } });

    if (!atleta) {
      return res.status(404).json({ erro: 'Atleta não encontrado' });
    }

    await atleta.destroy();

    res.status(200).json({ mensagem: 'Atleta excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir atleta:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Rota para editar os dados de admins
router.put('/editar', verifyAdminToken, async (req, res) => {
  try {
    const { user, senha } = req.body;

    // Encontra o admin pelo ID
    const admin = await Admin.findByPk(req.adminId);

    if (!admin) {
      return res.status(404).json({ erro: 'Admin não encontrado' });
    }

    // Atualiza as informações 
    if (user) {
      admin.user = user;
    }

    if (senha) {
      const hashSenha = await bcrypt.hash(senha, 10);
      admin.senha = hashSenha;
    }

    // Salva as alterações no admin
    await admin.save();

    res.status(200).json({ mensagem: 'Informações do admin atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao editar informações do admin:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

//Rota para listar todos os atletas com todos os dados, apenas 5 atletas por pagina
router.get('/atletas', verifyAdminToken, async (req, res) => {
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
