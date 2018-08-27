
/**
 * Configuración de puerto
 */
process.env.PORT = process.env.PORT || 3000;


/**
 * Configuración del entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Configuración de la base de datos
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {

	urlDB = 'mongodb://localhost:27017/cafe';
	
} else {

	urlDB = process.env.DB_URI;
	
}

process.env.URLDB = urlDB;

