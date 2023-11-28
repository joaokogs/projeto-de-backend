const Sequelize = require('sequelize');
const connection = new Sequelize('dojo','root','04112003',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;