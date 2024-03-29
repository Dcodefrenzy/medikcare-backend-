const express = require('express');
const {mongoose} = require("../db/mongoose.js");
const {ObjectID} = require('mongodb');
const {users} = require("./usersModel.js");
const _ = require('lodash');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client(process.env.OnesignalAppId, process.env.OnesignalApi);
//const ddj  = require("../../../../client/public/Dummy")

let imgPath;
const newDate = new Date();
if ( process.env.DEV_ENV) {
	console.log(newDate)
	imgPath = "/../../../../client/public/Images";
    imgPath2 = "/../../../../client/public/Dummy";
}else{
	imgPath = "/../../../../user/build/Images";
    imgPath2 = "/../../../../user/public/Images";
}

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, path.join(__dirname, imgPath))
	  cb(null, path.join(__dirname, imgPath2))
	},
	filename: function (req, file, cb) {
		cb(null,  Date.now()+file.originalname.replace(/\s/g, '-') )
	  }
  })
  const upload = multer({ storage: storage }, {limits: { fileSize: 2 }}).single('image');

  exports.updateImage =  (req, res, next) => {

		upload(req, res, function (err) {
			const id = req.user._id;
			console.log(req.file.filename)
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
				return promise.reject();
			}
			console.log("token check successful")
			req.user = body;
			req.isUser = true;
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
		lastLogin: new Date(),
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
			users.findByIdAndUpdate(user._id, {$set: {lastLogin:userUpdate.lastLogin, loginStatus:userUpdate.loginStatus}}).then((newUSer)=>{
				if(!newUSer) {
					const err = {status:403, message:"unable to update login status"}
					return res.status(403).send(err);
				}else{
					const userData = {status:200, token:token, name:user.firstname +" "+ user.lastname, _id:user._id,isUser:true, playerId:user.playerId};
					req.data = userData;
					req.data.loggerUser = "User";
					req.data.logsDescription = "User Login Was Successful";
					req.data.title = "Login";
					next();
				}
			}) 
		})
	}).catch((e)=>{
		console.log(e)
		res.status(403).send(e);
	});
}


exports.getUserMailsAndPlayerIDs= async (req, res, next)=>{
		users.find({}).then((user)=>{
			req.data.users = user;
			next();
		})
}
exports.notifyAppointment = async(req, res)=>{
	const mes = req.data.logsDescription;
	const playerId = req.data.playerId;
	const message = { 
		contents: {"en": mes},
		include_player_ids: [playerId]
	}
	try {
		const response = await client.createNotification(message);
		
		res.status(200).send({status:200});
		console.log(response.body.id);
	} catch (e) {
		if (e instanceof OneSignal.HTTPError) {
		// When status code of HTTP response is not 2xx, HTTPError is thrown.
		console.log(e.statusCode);
		console.log(e.body);
		res.send({status:403});
		}
	}
}
exports.notifyUser = (req, res)=>{
   const _id = req.body.to;
   const mes = req.body.message;
  users.findById({_id}).then(async(user)=>{
	  if (!user) {
		  const error = {status:403, message:"Unable to find user id."}
		  res.status(403).send(error);
	  }else {
		playerId = user.playerId;
		const message = { 
			contents: {"en": mes},
			include_player_ids: [playerId]
			}
			console.log(req.body);
		try {
			const response = await client.createNotification(message);
			
			res.status(200).send({status:200});
			console.log(response.body.id);
		} catch (e) {
			if (e instanceof OneSignal.HTTPError) {
			// When status code of HTTP response is not 2xx, HTTPError is thrown.
			console.log(e.statusCode);
			console.log(e.body);
			res.send({status:403});
			}
		}
	  }
  }).catch((e)=>{
	  const error = {status:403, message:"Unable to logout."}
	  res.status(403).send(error);
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

exports.chekMailVerification = (req, res, next)=>{
	const _id = req.user._id;
	users.findById({_id:_id}).then((user)=>{
		if (user.verification === true) {
			return user.generateAuthToken().then((token)=>{
				const userData = {status:200, token:token, email:user.email, name:user.firstname +" "+ user.lastname, _id:user._id};
				res.status(200).send(userData);
			})
		}else{
			next();
		}
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
exports.passwordChange =(req, res, next) =>{
	const email = req.user.email;
	const oldPassword = req.body.oldPassword;

	users.findByCredentials(email, oldPassword).then((user)=>{ 
		const userPassword = new users({
			password : req.body.newPassword,
		})
		users.findOneAndUpdate({_id:user._id}, {$set: {password:userPassword.password}}, {new:true}).then((user)=>{
				if(!user) {
					const err = {status:403, message:"unable to update password"}
					return res.status(403).send(err);
				}else {
					req.data ={status:201,loggerUser:"User", logsDescription:"Password change Was Successful",title:"Password Change", _id:user._id}
					next();
				}
		})
	}).catch((e)=>{
		const error = {status:403, message:"Email or password do not exist"}
		res.status(403).send(error);
	})
}
exports.findUserByMail = (req, res,next)=> {
	const email = req.body.email;

	users.findOne({email:email}).then((user)=> {
	if (!user) { 
		const err ={status:403, message:"No user with this id"};
		return res.status(403).send(err)
	}else {
		return user.generateAuthToken().then((token)=>{
			if(!token) {
				const err = {status:403, message:"unable to generate token"}
				return res.status(403).send(err);
			}else{	
				req.data = {status:201,token:token, email:user.email, name:user.firstname +" "+ user.lastname, _id:user._id,  loggerUser:"User", logsDescription:"There was a request to update your password. Please click the link below to get a new password",title:"New Password",link:`medikcare.com/user/forget-password/${token}`}
				next();
			}
		})
	}
	}).catch((e) => {
		return res.status(403).send(e);
	})
}
exports.newPasswordChange =(req, res, next) =>{
	const _id = req.user._id;
	users.findById({_id}).then((user)=>{ 
		const userPassword = new users({
			password : req.body.newPassword,
		})
		users.findOneAndUpdate({_id:_id}, {$set: {password:userPassword.password}}, {new:true}).then((user)=>{
				if(!user) {
					const err = {status:403, message:"unable to update password"}
					return res.status(403).send(err);
				}else {
					return user.generateAuthToken().then((token)=>{
						if(!token) {
							const err = {status:403, message:"unable to generate toke"}
							return res.status(403).send(err);
						}else{	
							req.data = {status:201,token:token, email:user.email, name:user.firstname +" "+ user.lastname, _id:user._id,  loggerUser:"user", logsDescription:"Password change Was Successful",title:"New Password Change"}
							next();
						}
					})
				}
		})
	}).catch((e)=>{console.log(e)
		const error = {status:403, message:"Email or password do not exist"}
		res.status(403).send(error);
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
exports.findUserByID = (req, res, next) => {
	let _id;
	if (req.body) {
		_id = req.body._userId;
	}else if (req.data) {
		_id = req.data.appointment.user;
	}
 console.log({"uid":_id})
    users.findById(_id).then((user)=>{
		console.log(user)
        if(!user) {
            const error = {status:403, message:"No user registered yet"}
            return res.status(403).send(error);
        }else {
             req.data.email = user.email;
            req.data.name =user.firstname +" "+ user.lastname;
            req.data.playerId =user.playerId;
			req.data._id = user._id;
			req.data.isUser = true;
                next();
        }
    }).catch((e)=>{
		console.log(e)
        res.status(403).send(e);
    })
}
  
exports.findAdminUserByID = (req, res, next) => {
    const _id = req.params.id;

    users.findById({_id:_id}).then((user)=>{
        if(!user) {
            const error = {status:403, message:"No user registered yet"}
            return res.status(403).send(error);
        }else {
			return user.generateAuthToken().then((token)=>{
				req.data = {status:200, token:token, email:user.email, name:user.firstname +" "+ user.lastname, _id:user._id,isUser:true};
				next();
			})
        }
    }).catch((e)=>{
		console.log(e)
        res.status(403).send(e);
    })
}

  
exports.findDoctorUserByID = (req, res, next) => {
    const _id = req.params.id;
 console.log({"finding user":_id })
    users.findById({_id:_id}).then((user)=>{
        if(!user) {
            const error = {status:403, message:"No user registered yet"}
            return res.status(403).send(error);
        }else {
			console.log("found user")
			res.status(200).send({"status":200, "message":{email:user.email, name:user.firstname +" "+ user.lastname, _id:user._id,isUser:true}});
				
        }
    }).catch((e)=>{
		console.log(e)
        res.status(403).send(e);
    })
}
  
var sendNotification = function(data) {
	var headers = {
	  "Content-Type": "application/json; charset=utf-8"
	};
	
	var options = {
	  host: "onesignal.com",
	  port: 443,
	  path: "/api/v1/notifications",
	  method: "POST",
	  headers: headers
	};
	
	var https = require('https');
	var req = https.request(options, function(res) {  
	  res.on('data', function(data) {
		console.log("Response:");
		console.log(JSON.parse(data));
	  });
	});
	
	req.on('error', function(e) {
	  console.log("ERROR:");
	  console.log(e);
	});
	
	req.write(JSON.stringify(data));
	req.end();
  };
  
 exports.updatePersonNotification=(req, res)=>{
	 const id = req.user._id;
	 const playerId = req.params.playerId;
	users.findByIdAndUpdate(id, {$set: { playerId:playerId}}, {new: true}).then((user)=>{
		if (!user) {
			const error = {status:403, message:"Unable to update player id."}
			res.status(403).send(error);
		}else {
	  
			res.status(200).send({status:200});
		}
	}).catch((e)=>{
		const error = {status:403, message:"Unable to logout."}
		res.status(403).send(error);
	}) 
 }

exports.sendPersonNotification = (req, res, next)=> {

	playerId = req.user.playerId
		let appid = "49bc3735-1264-4e8a-a146-f4291107deba"
		const message = { 
		app_id: appid,
		contents: {"en": "Hello this is your message"},
		include_player_ids: [playerId]
	  };
	  
  const result = sendNotification(message);
  res.status(200).send({status:200});

  }
  exports.sendChatNotification = (req, res, next)=>{
	playerId = req.data.playerId
	const msg = req.data.logsDescription
	let appid = "49bc3735-1264-4e8a-a146-f4291107deba"
	const message = { 
	app_id: appid,
	contents: {"en": msg},
	include_player_ids: [playerId]
  };
  
const result = sendNotification(message);
if (result) {
		next();
}
else{
	next();
}
  }
  exports.getUsersMetric = (req, res, next)=>{
	  users.countDocuments().then((count)=>{
		req.metric ={"userMetric":count};
		next();
	  })
  }

  exports.viewUsersByIds = async(req, res)=>{
		let newData;
		 newData = await req.data.message.map(async(data, index)=>{
			 const id = data.userId || data._userId;
			 console.log(id)
		user = await  users.findById({_id:id});
		return nData = {session:data, name:user.firstname+" "+user.lastname};
	});
	const resp = await Promise.all(newData);
	res.status(200).send({status:200,message:resp});

}


exports.getUsersForAppointment = async(appointments)=>{
	let newData;
	 newData = await appointments.map(async(appointment, index)=>{
		 
		// console.log(appointment)
	user = await  users.findById({_id:appointment.user});
	return nData = {appointment:appointment, user:user};
});

const resp = await Promise.all(newData);
return resp
}


exports.getUsersSessions = async(req, res,next)=>{
	req.data= [];
	let newData;
	newData = await req.body.map(async(data, index)=>{
   user = await  users.findOne({$or: [ {_id:data.from}, {_id:data.to}]});
    req.data.push({ sessions: JSON.stringify(data), users: JSON.stringify(user) });
});
	const resp = await Promise.all(newData);
	if (resp) {
		next();
	}
}


exports.viewUserNameById = (req, res, next)=>{
	users.findById({_id:req.params.id}).then((user)=>{
		req.data = {status:200, user:user};
		next();
	}).catch((e)=>{
		console.log(e)
		const error = {status:500, message:"No user Found."}
		res.status(500).send(error);
	}) 
}
exports.fetchUserById = (req, res, next)=>{
	users.findById({_id:req.params.id}).then((user)=>{
		req.data = {email:user.email, name:user.firstname+" "+user.lastname, playerId:user.playerId};
		next();
	}).catch((e)=>{
		console.log(e)
		const error = {status:500, message:"No user Found."}
		res.status(500).send(error);
	}) 
}

exports.userChatSession = (req, res, next)=>{
	console.log(req.body)
	users.findOne({$or: [ {_id:req.body.from}, {_id:req.body.to}]}).then((user)=>{
	//console.log({"user":user});
		if (user) {
		req.data = {"user":{_id:user._id, name:user.firstname+" "+user.lastname, email:doctorsSchema.email}};
		next();
		} else {
		req.data = {"user":"No user"};		
		next();
		}

	});
}


exports.notifyUserAppointment = async (appointments)=>{

	const notify = await appointments.map(async(appointment)=>{
		const message = { 
			contents: {"en": `Hello ${appointment.user.firstname+" "+appointment.user.lastname}, We will Like to remind you of your appointment with Dr ${appointment.doctor.firstname} which is on ${appointment.appointment.appointmentDate}.`},
			include_player_ids: [appointment.user.playerId]
			}
			try {
				console.log("here")
				return response = await client.createNotification(message);
				
			} catch (e) {
				if (e instanceof OneSignal.HTTPError) {
				// When status code of HTTP response is not 2xx, HTTPError is thrown.
				console.log(e.statusCode);
				console.log(e.body);
				
				console.log("err");
				}
			}
	})
	
	const notification = await Promise.all(notify);
	return notification;

 }

