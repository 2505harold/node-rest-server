
// VARIABLES DE CONFIGURACION


/*************************************************
 * Puerto
 *************************************************/

process.env.PORT = process.env.PORT || 3000;

/*************************************************
 * Entorno
 *************************************************/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/************************************************
* vencimiento dle token
************************************************/
//60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30


/************************************************
* seed de autenticacion del token
************************************************/

process.env.SEED = process.env.SEED  || 'este-es-el-seed-desarrollo'

/************************************************
 * Base de datos
 ************************************************/

let urlDB

if (process.env.NODE_ENV.toString() === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe"
}
else {
    urlDB = process.env.MONGO_URI.toString();
}

process.env.URLDB = urlDB;