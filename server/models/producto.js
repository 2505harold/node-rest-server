const mongoose = require("mongoose")
let Schema = mongoose.Schema;


let productoSchema = new Schema({
    nombre:{type:String,required:[true,'El nombre del producto es necesario']},
    precioUni:{type:Number,required:[true,'El precio unitario es requerido']},
    descripcion: {type:String,required:false},
    disponible:{type:Boolean,required:true,default:true},
    categoria:{type:Schema.Types.ObjectId,ref:'Categoria',},
    usuario: {type:Schema.Types.ObjectId,ref:'Usuario'},
    img:{type:String}
})


module.exports = mongoose.model('Producto',productoSchema)