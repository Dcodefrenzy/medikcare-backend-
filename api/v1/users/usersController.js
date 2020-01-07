const express = require('express');
const {mongoose} = require("../db/mongoose.js");
const {ObjectID} = require('mongodb');
const {users} = require("./usersModel.js");
const _ = require('lodash');
const multer = require('multer');
const path = require('path');



let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, path.join(__dirname, "/../../../../client/public/Images"))
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' +file.originalname )
	  }
  })
  const upload = multer({ storage: storage }, {limits: { fileSize: 2 }}).single('image');

  exports.updateImage =  (req, res, next) => {
		upload(req, res, function (err) {
			const id = req.user._id;
			if (err instanceof multer.MulterError) {
				return res.status(500).json(err)
			} else if (err) {
				return res.status(500).json(err)
			}
			const image = {filename:req.file.filename, path:req.file.path}

		users.findByIdAndUpdate(id, {$set: {image:image}}, {new:true}).then((user)=>{
			if (!user) {
			const error = {status:403, message:"No admin!"}
			return res.status(403).send(error);
			}
			user ={status:201, message:"upload successful."}
			res.status(201).send(user);
		}).catch((e)=>{
			console.log(e)
			const error = {status:403, message:e}
			return res.status(403).send(error);
		})

	})
}


exports.userAuthenticate =  (req, res, next)=>{
		//requesting our token from header.
		
		var token = req.header('u-auth');
		users.findByToken(token).then((body)=>{
			if (!body) {
				const error = {status:401, message:"unauthorised person"}
				return promise.reject(error);
			}
			console.log("token check successful")
			req.user = body;
			req.token = token;
			next();
	}).catch((e)=>{
		console.log(e)
		const error = {status:e.status, message:e.message}
		res.status(401).send(e);
	});
}

exports.adduser = (req, res, next)=>{
	var user = new users({
		email: req.body.email,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		phonenumber: req.body.phonenumber,
		gender: req.body.gender,
		age: req.body.age,
		verification:false,
		password: req.body.password,
		lastLogin: new Date,
		loginStatus: true,
		deleteUser: false,
		dateCreated: new Date,		
	});

	user.save().then((user)=>{
		if (!user) {
			const err = {status:404, message:"unable to add user"}
			return res.status(404).send(err);
		}
		return user.generateAuthToken().then((token) =>{
			
			const userData = {status:201, token:token, email:user.email, name:user.firstname +" "+ user.lastname, _id:user._id, isUser:true};
			req.data = userData;
			req.data.loggerUser = "User";
			req.data.logsDescription = "User Registration Was Successful";
			req.data.title = "Register";
			req.data.socialMedia = req.body.socialMedia;
			next();
		})
	}).catch((e)=>{
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(404).send(err);
	});
	
}

exports.findEmail = (req, res, next)=>{

		const email=  req.body.email;

	users.findOne({email:email}).then((user)=>{
		if (!user) {
			const err = {status:404, message:"unable to add user"}
			return res.status(404).send(err);
		}
		return user.generateAuthToken().then((token) =>{
			
			const userData = {status:201, token:token, email:user.email, name:user.firstname +" "+ user.lastname, _id:user._id, isUser:true};
			req.data = userData;
			req.data.loggerUser = "User";
			req.data.logsDescription = "User resending mail.";
			req.data.title = "resend Mail";
			req.data.socialMedia = req.body.socialMedia;
			next();
		})
	}).catch((e)=>{
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(404).send(err);
	});
	
}

exports.userLogin = (req, res, next)=>{
	const user = new users({
	email : req.body.email,
	password : req.body.password
});

users.findByCredentials(user.email, user.password).then((user)=>{
		return user.generateAuthToken().then((token)=>{
			const userUpdate = new users({
				lastLogin: new Date(),
				loginStatus: true,
			});
			users.findByIdAndUpdate(user._id, {$set: {lastLogin:userUpdate.lastLogin, loginStatus:userUpdate.loginStatus,}}).then((newUSer)=>{
				if(!newUSer) {
					const err = {status:403, message:"unable to update login status"}
					return res.status(403).send(err);
				}else{
					const userData = {status:200, token:token, name:user.firstname +" "+ user.lastname, _id:user._id,isUser:true};
					req.data = userData;
					req.data.loggerUser = "User";
					req.data.logsDescription = "User Registration Was Successful";
					req.data.title = "Login";
					next();
				}
			}) 
		})
	}).catch((e)=>{
		res.status(403).send(e);
	});
}

exports.logout =(req, res, next)=>{
	const id = req.user._id;
	const userUpdate = new users({
		loginStatus: false,
	});
	users.findByIdAndUpdate(id, {$set: { loginStatus:userUpdate.loginStatus,}}, {new: true}).then((user)=>{
		if (!user) {
			const error = {status:403, message:"Unable to logout."}
			res.status(403).send(error);
		}else {
			req.data = {status:201, title:"Logout", logsDescription:"User logout successful", loggerUser:"User", _id:id}
			next();
		}
	}).catch((e)=>{
		const error = {status:403, message:"Unable to logout."}
		res.status(403).send(error);
	})
}

exports.mailVerification = (req, res)=>{
	const id = req.user._id;
	const userUpdate = new users({
		lastLogin: Date.now,
		loginStatus: true,
		verification: true
	});
	users.findByIdAndUpdate(id, {$set: {verification:userUpdate.verification,lastLogin:userUpdate.lastLogin, loginStatus:userUpdate.loginStatus,}}, {new: true}).then((user)=>{
		return user.generateAuthToken().then((token)=>{
			const userData = {status:200, token:token, email:user.email, name:user.firstname +" "+ user.lastname, _id:user._id};
			res.status(200).send(userData);
		})
	}).catch((e)=>{
		console.log(e)
		res.status(403).send(e);
	})
}

//Returns conllections of users for only admin.
exports.viewusers = (req, res)=> {
	users.find().then((users)=>{
		if(!users) {
			const error = {status:404, message:"No User Found"}
			return res.status(404).send(error)
		}
		const userDetails = {status:200, users:users}
		res.status(200).json(userDetails);
	}).catch((e)=>{
			const error = {status:404, message:"No User Found"}
			return res.status(404).send(error)
	})
}

exports.returnUsersForMail = (req, res, next)=>{
	var userstatus = "active";
	users.find({userstatus}).then((data)=>{
		if (!data) {
		return res.status(404).send("Error No users");
		}
		req.data = data;
		next();

	}).catch((e)=>{
		res.status(404).send("No users");
	})
}

//returns a document of user.
exports.getuser =(req, res)=>{
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
	return res.status(404).send("error no object id found");
	}
	users.findById(id).then((user)=>{
		return user.generateAuthToken().then((token)=>{
		if (!user) {
			res.status(404).send("No user found");
		}
			res.header('u-auth', token).send(user);
		});
	}).catch((e)=>{
		res.status(404).send(e)
	})
}

exports.findUser  = (req, res,next)=> {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("error no object id found");
		}
		users.findById(id).then((user)=>{
			if(!user) {
				const error = {status:404, message:"No User Found"}
				return res.status(404).send(error)
			}
			req.user = user;
			next();
		}).catch((e)=>{
			res.status(404).send(e)
		})
}

exports.userProfile = (req, res, next)=> {
	const id = req.user._id;
	if(!ObjectID.isValid(id)) {
		const err = {status:404, message:"Bad user id"}
		return res.status(404).send(err);
	}
	users.findOne(id).then((user)=> {
	if (!user) { 
		const err ={status:403, message:"No user with this id"};
		return res.status(403).send(err)
	}
		 user.status = 200
		res.user = user;
		next();
	}).catch((e) => {
		return res.status(403).send(e);
	})
}

exports.logout =(req, res, next)=>{
	const id = req.user._id;
	const userUpdate = new users({
		loginStatus: false,
	});
	users.findByIdAndUpdate(id, {$set: { loginStatus:userUpdate.loginStatus,}}, {new: true}).then((user)=>{
		if (!user) {
			const error = {status:403, message:"Unable to logout."}
			res.status(403).send(error);
		}else {
			req.data = {status:201, title:"Logout", logsDescription:"User logout", loggerUser:"User", _id:id}
			next();
		}
	}).catch((e)=>{
		const error = {status:403, message:"Unable to logout."}
		res.status(403).send(error);
	})
}


exports.updateUser = (req, res, next)=>{
	const id = req.user.id;
	const user = new users({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		gender: req.body.gender,
		age: req.body.age,	
	});
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("err")
	}
	users.findByIdAndUpdate(id, {$set: {firstname:user.firstname, lastname:user.lastname,gender:user.gender, age:user.age}}, {new: true}).then((user)=>{
		if (!user) {
			const err ={status:403, message:"Unable to update"};
			return res.status(403).send(err);
		}
		req.data ={status:201,loggerUser:"User", logsDescription:"Profile information update  Successful",title:"Profile update", _id:id}
		next();
	}).catch((e)=>{
		res.status(404).send("unable to update");
	})
}

exports.deleteuser = (req, res)=>{
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("error no object id found");
	}
	users.findByIdAndRemove(id).then((data)=>{
		if (!data) {
			return res.status(404).send("unable to delete user");
		}
		res.status(200).send(data);
	}).catch((e)=>{
		res.status(404).send("e");
	})
}
exports.logout =(req, res, next)=>{
	const id = req.user._id;
	const userUpdate = new users({
		loginStatus: false,
	});
	users.findByIdAndUpdate(id, {$set: { loginStatus:userUpdate.loginStatus}}, {new: true}).then((user)=>{
		if (!user) {
			const error = {status:403, message:"Unable to logout."}
			res.status(403).send(error);
		}else {
			
			req.data = {status:201, title:"Logout", logsDescription:"User logout", loggerUser:"User", _id:id}
			next();
		}
	}).catch((e)=>{
		const error = {status:403, message:"Unable to logout."}
		res.status(403).send(error);
	})
}

