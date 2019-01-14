const express = require('express');
const Categoria = require('../modelos/categoria');
let { verificaToken, verifica_Admin } = require('../middlewares/autenticacion');

const app =  express();

//GET
app.get('/categoria', verificaToken, (req, res) => {

	Categoria.find( {})
		.sort( 'descripcion' )
		.populate( 'usuario', 'nombre email' ) //indica que otros objetos incluir y que atributos
		.exec( ( err, categorias ) => {
			if ( err ) {
				return res.status(400).json({
					ok: false,
					err
				})
			}

			Categoria.count({}, (err, c) => {
				res.json({
					ok:true,
					registros: c,
					categorias
				});
			});


		});

});

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

	Categoria.findById( id, (err, cat) => {
			if ( err ) {
				return res.status(400).json({
					ok: false,
					err
				})
			}

			if ( !cat ){
				return res.status(500).json({
					ok: false,
					err : {
						msg: 'El id no es correcto'
					}
				})
			}

            res.json({
                ok:true,
                categoria: cat
            });

		});

});

//POST
app.post('/categoria', verificaToken, (req, res) => {

	//contenido enviado por post
	let body = req.body;

	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id   //usuario que hace la peticion
	});

	categoria.save( (err,categoriaDB) => {
		if ( err ) {
			return res.status(500).json({
				ok: false,
				err
			})
		} 

        if ( !categoriaDB ){
            return res.status(400).json({
				ok: false,
				err
			})
        }
		res.json({
			ok:true,
			categoria: categoriaDB
		});


	});

});

//PUT el :id indica parametro id
app.put('/categoria/:id', verificaToken, (req, res) => {

	//se recupera el parametro
	let id = req.params.id;
	let body = req.body;
	let newCat = { descripcion: body.descripcion };

	//busca y actualiza
	Categoria.findByIdAndUpdate(id, newCat, { new:true, runValidators:true }, ( err, categoriaDB ) => { 
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			})
		}
		if ( !categoriaDB ){
            return res.status(400).json({
				ok: false,
				err
			})
        }
		res.json({
			ok: true,
			categoria: categoriaDB
		});		

	})

});

//DELETE
app.delete('/categoria/:id', [verificaToken, verifica_Admin], (req, res) => {
	
	let id = req.params.id;

	Categoria.findByIdAndRemove( id, ( err, cBorrado ) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		if ( !cBorrado ) {
			return res.status(400).json({
				ok: false,
				err:{
					msg:'Categoria no encontrada'
				}
			});
		}

		res.json({
			ok: true,
			categoria: cBorrado
		});
	});

});



module.exports = app;
