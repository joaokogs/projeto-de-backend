const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const connection = require('./database/database');

const AtletasRoutes = require('./ateltas/AtletasRoutes');
const DanRoutes = require('./dan/DanRoutes');
const AdminRoutes = require('./admin/AdminRoutes');

const install = require('./instalador');

const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger_doc.json');

//BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//databases
const Dan = require('./dan/Dan');
const Atletas = require('./ateltas/Atletas');
const Admin = require('./admin/Admin');

app.use("/atletas",AtletasRoutes);
app.use("/dans",DanRoutes);
app.use("/admin",AdminRoutes);
app.use("/",install);
app.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerFile));





connection
    .authenticate()
    .then(()=>{
        console.log("A conexão feita com sucesso!");
    }).catch((error)=>{
        console.log(error);
    })

app.listen(3000,()=>{
    console.log("Servidor Rodando!");
});





