

/*************************************************
 * Puerto
 *************************************************/

 process.env.PORT = process.env.PORT || 3000;

 /*************************************************
  * Entorno
  *************************************************/

  process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


  /************************************************
   * Base de datos
   ************************************************/

   let urlDB

   if(process.env.NODE_ENV.toString() === 'dev'){
       urlDB = "mongodb://localhost:27017/cafe"
   }
  else{
       urlDB = "mongodb+srv://harold:aSzpR5IlhlOFn9E6@cluster0-tm7ga.mongodb.net/cafe"
   }

   process.env.URLDB = urlDB;