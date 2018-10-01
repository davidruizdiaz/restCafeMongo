const express = require('express');
const Usuario = require('../modelos/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('underscore');

// Para usar autenticacion de Google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de Google - RUTA
app.post('/google', async (req, res) => {
	let token = req.body.idtoken;

	let googleUser = await verify(token)
			.catch( e => {
				return res.status(403).json({
					ok:false,
					err: e
				});
			} );

	Usuario.findOne({ email: googleUser.email},( err, u ) => {
		if ( err ) {
			return res.status(500).json({
				ok: false,
				err
			});
		};
		
		if(u){

			if( u.google === false ){
				return res.status(400).json({
					ok: false,
					err: {message:'Debe usar su autenticación normal'}
				});
			} else {
				// creacion del token
				let token = jwt.sign({
					usuario: u
				}, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

				return res.json({
					ok: true,
					usuario: u,
					token
				});
			}

		} else { // si el usuario no existe en la db

			let usuario = new Usuario();
			usuario.nombre = googleUser.nombre;
			usuario.email = googleUser.email;
			usuario.img = googleUser.img;
			usuario.google = true;
			usuario.password = ':)';

			usuario.save( (err, u) => {
				if ( err ) {
					return res.status(500).json({
						ok: false,
						err
					});
				};
				// creacion del token
				let token = jwt.sign({
					usuario: u
				}, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

				return res.json({
					ok: true,
					usuario: u,
					token
				});

			} )

		}
	})
});

// Funcion para verificar token de Google
async function verify( token ) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID
	});
	const payload = ticket.getPayload();
	
	return {
		nombre: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true
	}
  }

  





module.exports = app;
