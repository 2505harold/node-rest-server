const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos ={
    values:['ADMIN_ROLE','USER_ROLE'],
    mesage:['{VALUE} no es un rol valido']
}
let Schema = mongoose.Schema;

//definir nuestro esquema
let userSchema = new Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es necesario']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El correo es necesario']  
    },
    password:{
        type:String,
        required:[true,'El password es necesario']
    },
    img:{
        type:String
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});


//el moetodo tolson en un esquema siempre se llama 
//cuando se imprime el resultado
//hems modificado cuando se imprima en un json la propieddad pasword
userSchema.methods.toJSON = function(){
    let usuario = this;
    let userObject = usuario.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'})

//exportar el modelo, nombre del modelo
module.exports = mongoose.model('Usuario',userSchema)