const express = require('express');
const Usuario = require('../modelos/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.post('/login', (req, res) => {

	let body = req.body;

	Usuario.findOne({email: body.email}, ( err, u ) => {
		if ( err ) {
			return res.status(500).json({
				ok: false,
				err
			});
		} 
		if (!u) {
			return res.status(400).json({
				ok: false,
				err:{
					message: 'Usuario* o contraseña incorrectos'
				}
			});	
		}

		if ( !bcrypt.compareSync( body.password, u.password ) ) {
			return res.status(400).json({
				ok: false,
				err:{
					message: 'Usuario o contraseña* incorrectos'
				}
			});	
		}

		// creacion del token
		let token = jwt.sign({
			usuario: u
		}, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

		res.json({
			ok:true,
			usario: u,
			token
		});
		

	});
});










module.exports = app;
