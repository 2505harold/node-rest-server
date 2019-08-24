const express = require('express')
const fs = require('fs')
const path = require('path')
const {verificaTokenImg} = require('../middleware/autenticacion')
const app = express()

app.get('/imagen/:tipo/:img',verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img
    let pathImg = `./uploads/${tipo}/${img}`
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
    let noImagePath = path.resolve(__dirname, '../assets/not-found.png')

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    }
    else {
        res.sendFile(noImagePath)
    }

})

module.exports = app;