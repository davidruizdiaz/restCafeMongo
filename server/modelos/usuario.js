const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesList = {
	values: ['ADMIN_ROLE', 'USER_ROLE',],
	message: '{VALUE} no es un rol válido'
}

let usuarioSchema = Schema({
	nombre:{
		type: String,
		required: [true,'El nombre es necesario'],
	},
	email:{
		type: String,
		unique:true,
		required:[true,'El correo es necesario']
	},
	password:{
		type:String,
		required:[true,'El password es necesario']
	},
	img:{
		type:String,
		required: false
	},
	role:{
		type:String,
		default: 'USER_ROLE', //tiene que ser de la db
		enum: rolesList
	},
	estado:{
		type: Boolean,
		default: true
	},
	google:{
		type:Boolean,
		default:false
	}

});

// Para que no se imprima el password en el response
usuarioSchema.methods.toJSON = function(){
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;

	return userObject;
}

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );

module.exports = mongoose.model( 'Usuario', usuarioSchema );