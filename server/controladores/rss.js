const express = require('express');
const Rss = require('../modelos/rss');

let app = express();


// GET de productos con paginación, espera parametros desde y limite
app.get('/rss', async (req, res) => {

    try {
        const feelds = await Rss.find({});
        res.json({
            ok: true,
            feelds
        })
    } catch (e) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
});

// POST 
app.post( '/rss', (req, res) => {
    let body = req.body;

    let rss = new Rss({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        url: req.body.url,
    });

    rss.save( (err, feeld) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if ( !feeld ) {
            return res.status(400).json({
				ok: false,
				err
			})
        }

        res.json({
            ok: true,
            feeld
        })
    } );
    
} );

module.exports = app;
