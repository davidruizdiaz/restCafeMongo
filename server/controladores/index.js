const express = require('express');
const app = express();


// usar la configuracion de controladores/usuario
app.use( require('./usuario') );
// usar la configuracion de controladores/login
app.use( require('./login') );





module.exports = app;
