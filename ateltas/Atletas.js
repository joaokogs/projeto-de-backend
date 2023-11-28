const {Sequelize, DataTypes} = require('sequelize');
const connection = require('../database/database');
const Dan = require('../dan/Dan');


const Atletas = connection.define('atletas',{
    nome:{
        type: Sequelize.STRING,
        allowNull:false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false,
        unique: true,
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false, 
        unique: true,
    }
});

Dan.hasMany(Atletas);

Atletas.belongsTo(Dan)


  
// Descomentar se para criar a table
// Atletas.sync({force:true});


module.exports = Atletas;