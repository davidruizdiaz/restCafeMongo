
/**
 * Configuración de puerto
 */
process.env.PORT = process.env.PORT || 3000;


/**
 * Configuración del entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * Expiracion del token
 * 60seg * 60min * 24hs * 30dias 
 */
process.env.CADUCIDAD_TOKEN = '48h';


/**
 * SEED o clave secreta del token
 */
process.env.SEED = process.env.SEED || 'seed-c&s-devs-desarrollo'


/**
 * ClientId de google
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '317706409678-glt2csi85e9sh7sft06gqmjqlr9o4hqj.apps.googleusercontent.com'

/**
 * Configuración de la base de datos
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {

	urlDB = 'mongodb://localhost:27017/cafe';
	
} else {

    //DB_URI: mongodb://d4v1d:david123@ds133622.mlab.com:33622/cafe_drdm
	urlDB = process.env.DB_URI;
	
}

process.env.URLDB = urlDB;

