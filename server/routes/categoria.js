const express = require('express')
const Categoria = require('../models/categoria')
const {verificaToken,verificaRole} = require('../middleware/autenticacion')
const app = express();


/** Mostrar todas las categorias */
app.get('/categoria',verificaToken,(req,res)=>{
    Categoria.find()
        .sort({nombre:-1})
        .populate('usuario','nombre email') //que object ID existe en la categoria que estoy solicitando
        .exec((err,categoriaDB)=>{
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                categoria: categoriaDB
            })
        })
})

/** Mostrar categoria por ID */
app.get('/categoria/:idCategoria',(req,res)=>{
    

})

/** Crear una nueva categoria */
app.post('/categoria',verificaToken,(req,res)=>{
    let usuario = req.usuario;
    let categoria = new Categoria({
        nombre : req.body.nombre,
        usuario:usuario._id
    })

    categoria.save((err,categoriaDB)=>{
        if (err){// error de base de datos
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //evaluar si se creo la categoria
        if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok:true,
            categoria: categoriaDB
        })
    })

})


/** Actualiza una categoria por su ID */
app.put('/categoria/:idCategoria',[verificaToken,verificaRole],(req,res)=>{
    let id = req.params.idCategoria

    Categoria.findByIdAndUpdate(id,req.body,{new:true},(err,categoriaDB)=>{
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

         //evaluar si se actualizo la categoria
         if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
})

/** Elimina una categoria por su ID */
app.delete('/categoria/:id',[verificaToken,verificaRole], (req,res)=>{
    let id = req.params.id;
    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{

        //Si existe un error en la base de datos
        if (err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

         //evaluar si se elimino la categoria
         if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no existe'
                }
            })
        }

        res.json({
            ok:true,
            message: 'Categoria borrada'
        })
    })
})



module.exports = app;