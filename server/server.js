const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config.js');

// configuración de body parse
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



//GET
app.get('/usuario', (req, res) => {
	res.json('get usuario');
});

//POST
app.post('/usuario', (req, res) => {

	//contenido enviado por post
	let body = req.body;

	// si no existe el atributo esperado
	if ( body.nombre === undefined ) {

		res.status(400).json({
			ok: false,
			mensaje: "Se debe ingresar un nombre"
		});

	} else {
		res.json({
			persona: body
		});
	}

});

//PUT el :id indica parametro id
app.put('/usuario/:id', (req, res) => {

	//se recupera el parametro
	let id = req.params.id;
	res.json({
		id,
		usuario:'usuario'
	});
});

//DELETE
app.delete('/usuario', (req, res) => {
	res.json('delete usuario');
});

app.listen(process.env.PORT,()=>{
	console.log('Escuchando el puerto ', process.env.PORT);
})