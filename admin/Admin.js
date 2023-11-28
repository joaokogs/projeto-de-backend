const Sequelize = require('sequelize');
const connection = require('../database/database');
const bcrypt = require('bcryptjs');

const Admin = connection.define('admins',{
    user:{
        type: Sequelize.STRING,
        allowNull: false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    }    
});

// Admin.sync({force:true});

module.exports = Admin;
