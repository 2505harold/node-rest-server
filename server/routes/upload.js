const express = require('express')
const fileUpload = require('express-fileupload')
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

//default options
app.use(fileUpload())

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    }


    //validar tipo
    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipo validas son ' + tiposValidos.join(',')
            }
        })
    }


    //obtenemos el archivo
    let sampleFile = req.files.archivo

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif']
    let nombreCortado = sampleFile.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones validas son ' + extensionesValidas.join(',')
            }
        })
    }

    //cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    sampleFile.mv(`uploads/${tipo}/${nombreArchivo}`, function (err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aqui la imagen ya esta cargada y guardaremos el nombre del archivo en la base de datos
        if (tipo === 'usuarios') imagenUsuario(id,res,nombreArchivo)
        else imagenProducto(id,res,nombreArchivo)
        
    });

});


function imagenUsuario(id,res,nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if(err){
            //considerar que aunque xista un error la imagen fu subida
            borraArchivo(nombreArchivo,'usuarios')
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!usuarioDB){
            borraArchivo(nombreArchivo,'usuarios')
            return res.status(500).json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            })
        }

        //confirma que el path de la imagen existe en filesystem
        borraArchivo(usuarioDB.img,'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuaario:usuarioGuardado,
                imagen:nombreArchivo
            })
        })

    })
}

function imagenProducto(id,res,nombreArchivo) {

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            borraArchivo(nombreArchivo,'productos')
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!productoDB){
            borraArchivo(nombreArchivo,'productos')
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Producto no econtrado'
                }
            })
        }

        //validamos si existe una imagen cargada para poder extrae su ruta
        //para borrar el archivo de nuestro file system
        borraArchivo(productoDB.img,'productos')


        productoDB.img = nombreArchivo;
        productoDB.save((err,productoGuardado)=>{
            res.json({
                ok:true,
                producto:productoGuardado,
                imagen: nombreArchivo
            })
        })

    })

}

function borraArchivo(nombreImagen,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`)
    if (fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app