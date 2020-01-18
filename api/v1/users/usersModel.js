const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require('lodash');



const userSchema = new mongoose.Schema({
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
	firstname: {
		type: String,
		required: true,
		trim: true,
		minlenght: 3,
	},
	lastname: {
		type: String,
		required: true,
		trim: true,
		minlenght: 3,
	},
	phonenumber: {
		type: Number,
		trim:true,
		required: true,
		unique: true,	
	},
	gender:{
		type: String,
		required: true,
		trim: true,
		minlenght:1,
	},
	age: {
		type: String,
		require:true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlenght: 6,
	},
	image: {
		filename:{
			type:String,
			required:false,
		},
		path:{
			type:String,
			required:false,
		}
	},
	verification: {
		type :Boolean,
		required: true,
		trim: true,
	},
	lastLogin: {
		type:String,
		required: true,
	},
	loginStatus: {
		type:Boolean,
		required:true,
	},
	deleteUser: {
		type: Boolean,
		required: true, 
	},
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	},

	dateCreated:{
		type: String,
		required:true,
	},
});


	userSchema.pre('save', function(next){
		const user = this;

		if (user.isModified('password')) {
			bcrypt.genSalt(10, (err, salt)=>{
				bcrypt.hash(user.password, salt, (err, hash)=>{
					user.password = hash;
					next();
				});
			});
		}else{
			next();
		}
	});

	userSchema.methods.toJSON = function(){
		const user = this;
		const userObject = user.toObject();
		return _.pick(userObject, ['_id', 'email', 'firstname', 'lastname',  'phonenumber', 'gender', 'age', 'verification','image', 'lastLogin','loginStatus','dateCreated']);
	};


		//creating an authentication token for user
	userSchema.methods.generateAuthToken = function(){
		//this keyword represent the object that uses this method.
		const user = this;
		const access = 'auth';
		//using the user id to generate a token which will expire.
		const token = jwt.sign({_id: user._id.toHexString(), access}, 'mongsufsrenz##', {expiresIn: '12h'});
	
		return user.save().then(()=>{
			return token;
		});
	};
userSchema.statics.findByCredentials = function (email, password){
	const user = this;
	return user.findOne({email}).then((body)=>{
		if (!body) {
			const err = {status:400, message:"User do not exist."}
			return Promise.reject(err);
		}
		if(body.deleteUser === true) {
			const err = {status:400, message:"This user has been deleted."}
			return Promise.reject(err);
		}
		return new Promise((resolve, reject)=>{
			bcrypt.compare(password, body.password, (err, res)=>{
				if (res) {
					return resolve(body);
					
				}else{
					const error = {status:403, message:"Email or password do not exist"}
					return reject(error);
				}	
			})
		})
	})
}


	//find by token
	userSchema.statics.findByToken = function(token){
		const user = this;
		let decode;
		try{
			decode = jwt.verify(token, 'mongsufsrenz##');
		}catch(e){
			return new Promise((resolve, reject)=>{
				e.status = 401;
				return reject(e);
			});
		}	
		return user.findOne({
			'_id':decode._id,
			//'tokens.token': token,
			//'tokens.access': 'auth',
		});
	}



const users = mongoose.model('users', userSchema);

module.exports = {users};
