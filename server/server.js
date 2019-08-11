require('./config/config')
const express = require('express')
const app = express()


//Middlewares-cada peticion siempre pasa por estas lineas
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Routes
app.get('/usuarios',(req,res)=>{
    res.json('get usuario')
})

app.post('/usuarios',(req,res)=>{
    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok:false,
            mensaje: "El nombre es necesario"
        })
    }
    res.json({persona:body})
})

app.put('/usuarios/:id',(req,res)=>{
    let id = req.params.id; 
    res.json({
        id,
    })
})

app.delete('/usuarios',(req,res)=>{
    res.json('delete usuario')
})

app.listen(process.env.PORT,()=>{
    console.log(`escuchando en el puerto ${process.env.PORT}`)
})