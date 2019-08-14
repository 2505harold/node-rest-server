const jwt = require('jsonwebtoken')

/**
 * VERIFICAR TOKEN
 */

 let verificaToken = (req,res,next)=>{

    let token = req.get('token');
    jwt.verify(token, process.env.SEED,(err,decoded)=>{
        if (err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token nonvalido'
                }
            })
        }

        //en el decoded esta la informacion dle usuario - payload
        //en el reques agregamos una nueva propiedad 'usuario'
        //es igual a todo lo que se encuentra el payload con la propiedad 'usuario'
        req.usuario = decoded.usuario
        next();
    })
   
 }

/**
 * VERIFICAR ADMIN ROL
 */
let verificaRole = (req,res,next)=>{
    let usuario = req.usuario
    if(usuario.role == 'USER_ROLE'){
        return res.status(401).json({
            ok:false,
            err:{
                message:'Solo los usuarios ADMIN_ROLE puede actualizar'
            }
        })
    }
    next();
}

 module.exports={
     verificaToken,
     verificaRole
 }