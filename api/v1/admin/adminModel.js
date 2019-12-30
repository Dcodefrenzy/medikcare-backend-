const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require('lodash');


var adminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlenght: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{value} is not a valid email',
		},
	},
	phoneNumber: {
		type: Number,
		required: true,
		minlenght: 11,
		maxlength: 11,
	},
	firstname: {
		type: String,
		required: true,
		trim: true,
		minlenght:3,

	},
	lastname: {
		type: String,
		required: true,
		trim:true,
		minlenght:3,
	},
	level: {
		type: Number,
		required: true,
	},
	password: {
			type: String,
			required: true,
			trim: true,
			minlenght: 6,
	},
	verification : {
		type: Number,
		reqired:true,
	},
	image: {
		type:String,
		required:false,
	},
	dateCreated: {
		type: String,
		required:true,
	},
	deleteAdmin: {
		type: Number,
		required: true, 
	},
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	},
	_createdBy: {
		type: String,
		required: true,
		trim: false,
	},
});

	adminSchema.pre('save', function(next){
		var admin = this;
		if (admin.isModified('password')) {
			bcrypt.genSalt(10, (err, salt)=>{
				bcrypt.hash(admin.password, salt, (err, hash)=>{
					admin.password = hash;
					next();
				});
			});
		}else{
			next();
		}
	});

	adminSchema.methods.toJSON = function(){
	var admin = this;
	var adminObject = admin.toObject();

	return _.pick(adminObject, ['_id', 'email', 'firstname','lastname','phoneNumber','level','verification']);
};


		//creating an authentication token for admin
	adminSchema.methods.generateAuthToken = function(){
		var admin = this;
		var access = 'auth';
		var token = jwt.sign({_id: admin._id.toHexString(), access}, 'mobigasapp##', {expiresIn: '30m'});	
		return admin.save().then(()=>{
			return token;
		});
	};

	//find by credential logs admin in.
	adminSchema.statics.findByCredentials = function (email, password){
	var admin = this;
	return admin.findOne({email}).then((body)=>{
		if (!body) {
			return Promise.reject();
		}
		return new Promise((resolve, reject)=>{
			bcrypt.compare(password, body.password, (err, res)=>{
				if (res) {
					resolve(body);
				}else{
					reject();
				}	
			});
		});
	});
}


	//find by token
	adminSchema.statics.findByToken = function(token){
		var admin = this;
		var decode;
		try{
			decode = jwt.verify(token, 'mobigasapp##');
		}catch(e){
			return new Promise((resolve, reject)=>{
				return reject();
			});
		}	
		return admin.findOne({
			'_id':decode._id,
		});
	}



var admins = mongoose.model('Admins', adminSchema);

module.exports = {admins};
