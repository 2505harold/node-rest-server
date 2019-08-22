const express = require('express')
const app = express();
const { verificaToken } = require('../middleware/autenticacion')
const Producto = require('../models/producto')


//=====================
// Listar todos los productos
//=====================
app.get('/productos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (productosDB.length == 0) {
                return res.status(400).json({
                    message: 'No existen registros'
                })
            }

            res.json({
                ok: true,
                producto: productosDB
            })
        })
})

//=====================
// Listar producto por ID
//=====================
app.get('/productos/:id', (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario','nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe coincidencia'
                    }

                })
            }
            res.json({
                ok: true,
                producto: productosDB
            })
        })
})


//=====================
// Buscar productos
//=====================

app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{
    
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
        .populate('categoria','nombre')
        .exec((err,productoDB)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok:true,
                producto: productoDB
            })
        })

})

//=====================
// Crear producto
//=====================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save(producto, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

//=====================
// Actualizar producto por ID
//=====================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = req.body
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

//=====================
// Elimina producto por ID - solo se pone SIN STOCK
//=====================
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productosDB,
            mensaje: 'Producto cambiado a no disponible'
        })
    })
})


module.exports = app