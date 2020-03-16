const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require('lodash');
const {admins} = require("../../../admin/adminModel");


doctorsSchema = mongoose.Schema({
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
	playerId: {
		type :String,
		required: false,
	},
    adminVerification: {
            verification: {
                type:Boolean,
                require:true,
                default:false,
            },
            verifiedBy: {
                type:mongoose.Schema.Types.ObjectId,
				require:false,
				ref:admins,
            },
    },
	lastLogin: {
		type:String,
		required: true,
	},
	loginStatus: {
		type:Boolean,
		required:true,
	},
	profileCompleted:{
		type:Boolean,
		require:true,
		default:false,
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

doctorsSchema.pre('save', function(next){
	const doctor = this;
	if(doctor.isModified("password")){
		bcrypt.genSalt(10, (err, salt)=>{
			bcrypt.hash(doctor.password, salt, (err, hash)=>{
				doctor.password = hash;
				next();
			});
		});
	}else {
		next();
	}
});

doctorsSchema.pre('findOneAndUpdate', function(next){
	var doctor = this.getUpdate(); 
	if (doctor.$set.password) {
		bcrypt.genSalt(10, (err, salt)=>{
			bcrypt.hash(doctor.$set.password, salt, (err, hash)=>{
				this.getUpdate().$set.password = hash;
				next();
			});
		});
	}else{
		next();
	}
});


doctorsSchema.methods.toJSON = function(){
	const doctor = this;
	const doctorObject = doctor.toObject();
	return _.pick(doctorObject, ['_id', 'email', 'firstname', 'lastname',  'phonenumber', 'gender', 'age','deleteUser', 'verification','dateCreated','image','loginStatus','adminVerification','profileCompleted']);
};

		//creating an authentication token for doctors
		doctorsSchema.methods.generateAuthToken = function(){
			//this keyword represent the object that uses this method.
			const doctor = this;
			const access = 'u-auth';
			//using the user id to generate a token which will expire.
			const token = jwt.sign({_id: doctor._id.toHexString(), access}, 'mongsufsrenz##', {expiresIn: '12h'});
			return doctor.save().then(()=>{
				return token;
				next()
			});
		};

	doctorsSchema.statics.findByCredentials = function (email, password){
		const doctor = this;
		return doctor.findOne({email}).then((body)=>{
			console.log("email check..")
			if (!body) {
				const err = {status:400, message:"You do not have an account with us please register and try again."}
				return Promise.reject(err);
			}
			if(body.deleteUser === true) {
				const err = {status:400, message:"This doctor has been deleted."}
				return Promise.reject(err);
			}
			return new Promise((resolve, reject)=>{
				bcrypt.compare(password, body.password, (err, res)=>{
					if (res) {
						return resolve(body);
						console.log("Compare pass..")
					}else{
						const error = {status:403, message:"Email or password do not exist"}
						return reject(error);
					}	
				})
			})
		})
	}

		//find by token
		doctorsSchema.statics.findByToken = function(token){
			const doctor = this;
			let decode;
			try{
				decode = jwt.verify(token, 'mongsufsrenz##');
			}catch(e){
				return new Promise((resolve, reject)=>{
					e.status = 401;
					return reject(e);
				});
			}	
			return doctor.findOne({
				'_id':decode._id,
			});
		}

const doctors = mongoose.model('doctors', doctorsSchema);

module.exports = {doctors};