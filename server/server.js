require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()


//Middlewares-cada peticion siempre pasa por estas lineas
app.use(express.urlencoded({extended:false}));
app.use(express.json())

//rutas
app.use(require('./routes/usuarios'));

//Connect to database
mongoose.connect(process.env.URLDB,
            {useNewUrlParser:true,useCreateIndex:true},
            (err,resp)=>{
    //definir un callback
    if(err) throw err;
    console.log('Base de datos conectado')
})

app.listen(process.env.PORT,()=>{
    console.log(`escuchando en el puerto ${process.env.PORT}`)
})