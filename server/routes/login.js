const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario')//Schema usuario
const app = express();

app.post('/login',(req,res)=>{
    let body =req.body;
    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if (!usuarioDB){//si el usuario no existe
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)){//usuario existe pero los password no son iguales
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }

        let token = jwt.sign({
            usuario:usuarioDB
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})

        res.json({
            ok:true,
            Usuario:usuarioDB,
            token
        })
    })
})


//configracion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email:payload.email,
        img: payload.picture,
        google: true
    }

  }


app.post('/google',async (req,res)=>{
    //con posteo de google recibimol el token
    let token = req.body.idtoken
    let googleUser = await verify(token)
        .catch(err =>{
            return res.status(403).json({
                ok:false,
                err
            })
        })
    
    //lamamos del schema Usuario su metodo findone para saber
    //si existe un usuario con ese correo de google
    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
        //si sucede un error interno el servidor
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        
        //Si usuario existe
        if(usuarioDB){
            //Si en caso el usuario ya cuenta con una autenticacion de google inicial en la BD
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message :'Debe usar su autenticacion normal'
                    }
                })
            }else{//Se ha autentica por google y quiero renovar su token 
                let token = jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                })
            }
        }else{
            //Si el usuariono existe
             //creamos un nuevo objeto dek Schema Usuario
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = '123'

            //luego de generar el schema usuario
           
            usuario.save((err,usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                })
            })
        }
    })
})

module.exports=app