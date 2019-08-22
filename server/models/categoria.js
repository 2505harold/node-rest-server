const mongoose = require('mongoose')


let Schema = mongoose.Schema;

//Definimos el Schema para categoria
let categoriaSchema = new Schema({
    nombre: {
        type:String,
        required: [true,"El nombre de la categoria es requerido"]
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref:'Usuario'
    }
})


module.exports = mongoose.model('Categoria',categoriaSchema)
