const Sequelize = require('sequelize');
const connection = require('../database/database');

const Dan = connection.define('dans',{
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },    
});


// Dan.sync({force:true});

module.exports = Dan;