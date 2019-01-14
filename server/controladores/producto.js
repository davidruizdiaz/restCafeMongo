const express = require('express');
const Producto = require('../modelos/producto');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();


// GET de productos con paginación, espera parametros desde y limite
app.get('/producto', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limit = req.query.limite || 10;
    limit=  Number(limit);

    Producto.find({ disponible: { $eq: true } })
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion' )
        .exec( ( err, productos ) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({}, (err, c) => {
                res.json({
                    ok: true,
                    registros: c,
                    productos
                })
            })

        } );

});

// GET de productos con parametro id
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;
    Producto.find({ $and: [{_id:{$eq:id}, disponible: { $eq: true } }] }, ( err, producto ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            producto
        })
    })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion' );
    

});

// Buscar producto
app.get( '/producto/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    
    /** Se crea una expresión regular basada en el término y 
     * se le pasa como valor condisional */
    let regex = new RegExp(termino, 'i');
    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion' )
        .exec( (err, prdcts) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            
            res.json({
                ok: true,
                productos: prdcts
            })
        });
        
});

// POST 
app.post( '/producto', verificaToken,(req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, prod) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if ( !prod ) {
            return res.status(400).json({
				ok: false,
				err
			})
        }

        res.json({
            ok: true,
            producto: prod
        })
    } );
    
} );

// PUT el :id indica parametro id
app.put( '/producto/:id', verificaToken, ( req, res ) =>{
    let id = req.params.id;
    let body = req.body;
    let newProd = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    }
    Producto.findByIdAndUpdate( id, newProd, (err, prod) => {
        if (err) {
			return res.status(500).json({
				ok: false,
				err
			})
		}
		if ( !prod ){
            return res.status(400).json({
				ok: false,
				err:{
                    message: 'El id no existe'
                }
			})
        }
		res.json({
			ok: true,
			producto: prod
		});		
    } );
});

// DELETE el :id indica parametro id
app.delete( '/producto/:id', verificaToken, ( req, res )=>{
    let id = req.params.id
    let delProd = {
        disponible:false
    }
    Producto.findByIdAndUpdate( id, delProd, ( err, prod )=>{
        if (err) {
			return res.status(500).json({
				ok: false,
				err
			})
		}
		if ( !prod ){
            return res.status(400).json({
				ok: false,
				err
			})
        }
		res.json({
			ok: true,
			producto: prod
		});		

    })
});

module.exports = app;
