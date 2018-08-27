const express = require('express');
const Usuario = require('../modelos/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();



//GET
app.get('/usuario', (req, res) => {

	// recupera consulta
	let desde = req.query.desde || 0;
	desde = Number(desde);		   	//convierte a number

	let limite = req.query.limite || 5;
	limite = Number(limite);
	
	Usuario.find({ estado:true }, 'nombre email role estado google img')
		.skip(desde)      //paginación
		.limit(limite)
		.exec( (err, usuarios) => {
			if ( err ) {
				return res.status(400).json({
					ok: false,
					err
				})
			}

			Usuario.count({}, (err, c) => {
				res.json({
					ok:true,
					registros: c,
					usuarios
				});
			});


		})

});

//POST
app.post('/usuario', (req, res) => {

	//contenido enviado por post
	let body = req.body;

	let usuario = new Usuario({
		nombre:body.nombre,
		email:body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	});

	usuario.save( (err,usuarioDB) => {
		if ( err ) {
			return res.status(400).json({
				ok: false,
				err
			})
		} 

		res.json({
			ok:true,
			usario: usuarioDB
		});


	});

});

//PUT el :id indica parametro id
app.put('/usuario/:id', (req, res) => {

	//se recupera el parametro
	let id = req.params.id;

	// _.pick construye un objeto con las solo propiedades del array que se le pasa
	// eso se hace para excluir el pass y google del objeto body
	let body = _.pick(req.body, ["nombre","email","img","role","estado"]);	

	//busca y actualiza
	Usuario.findByIdAndUpdate(id, body, {new:true,runValidators:true}, (err, usuarioDB) => { 
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			})
		}

		res.json({
			ok: true,
			usuario: usuarioDB
		});		

	})

});

//DELETE
app.delete('/usuario/:id', (req, res) => {
	
	let id = req.params.id;

	let cambiaEstado = {
		estado:false
	}

	Usuario.findByIdAndUpdate(id, cambiaEstado,{ new: true }, ( err, uBorrado ) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		if ( !uBorrado ) {
			return res.status(400).json({
				ok: false,
				err:{
					msg:'Usuario no encontrado'
				}
			});
		}

		res.json({
			ok: true,
			usuario: uBorrado
		});
	});

});


module.exports = app;
