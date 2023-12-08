const Sequelize = require('sequelize');
const connection = require('../database/database');

const Dan = connection.define('dans', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reprovados: {
        type: Sequelize.INTEGER,
        defaultValue: 0 
    }
});

// Dan.sync({force:true});

module.exports = Dan;
