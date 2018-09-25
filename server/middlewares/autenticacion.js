const jwt = require('jsonwebtoken');

/**
 * Verifica token
 */
let verificaToken = (req, res, next) => {
    //requpera el token del header
    let token = req.get('token');

    jwt.verify( token, process.env.SEED, ( err, decoded ) => {

        // si existe un error al decodificar
        if( err ) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        // se retorna el usuario guardado en el playload
        req.usuario = decoded.usuario;

        // sigue la ejecución del programa
        next();
        
    } );

}

/**
 * Verifica Admin Role
 */
let verifica_Admin = ( req, res, next ) => {
    let usuario = req.usuario;
    
    if ( usuario.role !== 'ADMIN_ROLE' ){
        return res.json({
            ok: false,
            err: { 
                message: "No tiene privilegios de Administrador" 
            }
        })
    }
    next();
}


module.exports = {
    verificaToken,
    verifica_Admin
}