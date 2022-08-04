const express = require('express');
const app = express();


// usar la configuracion de controladores/usuario
app.use( require('./usuario') );
// usar la configuracion de controladores/login
app.use( require('./login') );
// usar la configuracion de controladores/categoria
app.use( require('./categoria') );
// usar la configuracion de controladores/producto
app.use( require('./producto') );
// usar la configuracion de controladores/rss
app.use( require('./rss') );




module.exports = app;
