const express = require('express');
const Usuario = require('../models/usuario')
const {verificaToken,verificaRole} = require('../middleware/autenticacion')
const app = express();
const bcrypt = require('bcrypt')
const _ = require('underscore')

//Routes
app.get('/usuarios',verificaToken,(req,res)=>{

    return res.json({
        usuario:req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    })

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({estado:true},'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec( (err,usuarios)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }
                
                Usuario.count({estado:true},(err,conteo)=>{
                    res.json({
                        ok:true,
                        usuarios,
                        conteo
                    })
                })
            })
})


//crear usuario
app.post('/usuarios',verificaToken,(req,res)=>{
    let body = req.body;
    //crear un objeto con nuevos elementos del schema usuario
    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:  bcrypt.hashSync(body.password,10),
        role: body.role
    })

    usuario.save((err,usuarioDB)=>{
        if(err){
            //le ponemos return para que salga de la funcion
            return res.status(400).json({
                ok:false,
                err
            });
        }

        //No quiero que me muestre el password
        //usuarioDB.password = null;

        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })
})


//actualizar usuarios
app.put('/usuarios/:id',[verificaToken,verificaRole],(req,res)=>{
    let id = req.params.id; 
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err,usuarioDB)=>{
        if(err){
            //le ponemos return para que salga de la funcion
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            usuario:usuarioDB
        })
        
    })

   
})


//eliminar usuarios
app.delete('/usuarios/:id',[verificaToken,verificaRole],(req,res)=>{
    let id = req.params.id;
    let cambiaEstado ={
        estado:false
    }
    Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            usuario:usuarioBorrado
        })
    })

    /** Elimina todo el registro */
    // Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
    //     if(err){
    //         //le ponemos return para que salga de la funcion
    //         return res.status(400).json({
    //             ok:false,
    //             err
    //         });
    //     }

    //     if(usuarioBorrado==null){
    //         return res.status(400).json({
    //             ok:false,
    //             err:{
    //                 message:'Usuario no encontrado'
    //             }
    //         })
    //     }
    //     res.json({
    //         ok:true,
    //         usuario:usuarioBorrado
    //     })
    // })


})

module.exports=app;
