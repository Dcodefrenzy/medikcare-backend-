const express = require('express');
const {mongoose} = require("../../../db/mongoose");
const {ObjectID} = require('mongodb');
const {doctors} = require("./doctorsModel");
const multer = require('multer');
const path = require('path');

let imgPath;
if ( DEV_ENV == "development") {
	imgPath = "/../../../../client/public/Images";
}else{
	imgPath = "/../../../../client/build/Images"
}

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, path.join(__dirname, imgPath))
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' +file.originalname )
	  }
  })
  const upload = multer({ storage: storage }, {limits: { fileSize: 2 }}).single('image');

  exports.updateImage =  (req, res, next) => {
		upload(req, res, function (err) {
            const id = req.doctor._id;
            console.log(req.file)
			if (err instanceof multer.MulterError) {
                console.log(err)
				return res.status(500).json(err)
			} else if (err) {
                console.log(err)
				return res.status(500).json(err)
			}
            const image = {filename:req.file.filename, path:req.file.path}


		doctors.findByIdAndUpdate(id, {$set: {image:image}}, {new:true}).then((doctor)=>{
			if (!doctor) {
			const error = {status:403, message:"No user update!"}
			return res.status(403).send(error);
			}
			doctor ={status:201, message:"upload successful."}
			res.status(201).send(doctor);
		}).catch((e)=>{
			console.log(e)
			const error = {status:403, message:e}
			return res.status(403).send(error);
		})

	})
}



exports.doctorAuthenticate =  (req, res, next)=>{
        //requesting our token from header.
        const token = req.header('u-auth');
        doctors.findByToken(token).then((body)=>{
            if (!body) {
                return promise.reject();
            }
            req.doctor = body;
            req.token = token;
            next();
    }).catch((e)=>{
        const error = {status:e.status, message:e.message}
        res.status(401).send(e);
    });
}

exports.doctorRegister = (req, res, next) =>{
    console.log(req.body);
        const doctor = new doctors({
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
        
        doctor.save().then((doctor)=>{
            console.log("saving doctor data..")
            if (!doctor) {
                console.log("Can not add doc..")
                const err = {status:404, message:"unable to add doctor"}
                return res.status(404).send(err);
            }
           return doctor.generateAuthToken().then((token) =>{
                const doctorData = {status:201, token:token, email:doctor.email, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id, isDoctor:true};
                
                req.data = doctorData;
                req.data.loggerUser = "Doctor";
                req.data.logsDescription = "Doctor "+ doctorData.name+" Registration Was Successful";
                req.data.title = "Register";
                req.data.socialMedia = req.body.socialMedia;
                console.log("Added dotors data and created a token");
                next();
            })
        }).catch((e)=>{
            
            let err ={}
            if(e.errors) {err = {status:403, message:e.errors}}
            else if(e){err = {status:403, message:e}}
            res.status(404).send(err);
        })
}

exports.doctorLogin = (req, res, next) =>{
    const doctor = new doctors({
        email : req.body.email,
        password : req.body.password
    });
    console.log("recieve request");
    
    doctors.findByCredentials(doctor.email, doctor.password).then((doctor)=>{
        return doctor.generateAuthToken().then((token)=>{
            //console.log("get user and return a token");

            const doctorUpdate = new doctors({
                lastLogin:new Date(),
                loginStatus: true,
            });
            doctors.findByIdAndUpdate(doctor._id, {$set: {lastLogin:doctorUpdate.lastLogin, loginStatus:doctorUpdate.loginStatus}}).then((newDoctor)=>{
                if(!newDoctor) {
                    const err = {status:403, message:"unable to update login status"}
                    return res.status(403).send(err);
                }else{
                    console.log("updated doctor loginstatus.")
                    const doctorDetails = {status:200, token:token, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id,playerId:doctor.playerId};
                    res.status(200).send(doctorDetails);
                }
            }) 
        })
    }).catch((e)=>{
        console.log("geeg")
        console.log(e)
        res.status(403).send(e);
    });
}

exports.adminVerification = (req, res)=>{
   const _id  = req.params.id;
   const adminVerification  = {verification:true, verifiedBy:req.admin._id}

   doctors.findByIdAndUpdate(_id, {$set: {adminVerification:adminVerification}}, {new:true}).then((verifiedDOctor)=>{
            if (!verifiedDOctor) {
                const err = {status:403, message:"We couldnt verify this doctor at this time"}
                res.status(403).send(err);
            }
            const verificationMessage  = {status:201, message:"Doctor Verified."}
            res.status(201).send(verificationMessage);
   }).catch((e)=>{
       res.status(403).send(e)
   })
}

exports.mailVerification = (req, res)=>{
	const id = req.doctor._id;
	const doctorUpdate = new doctors({
		lastLogin: Date.now,
		loginStatus: true,
		verification: true
	});
	doctors.findByIdAndUpdate(id, {$set: {verification:doctorUpdate.verification,lastLogin:doctorUpdate.lastLogin, loginStatus:doctorUpdate.loginStatus,}}, {new: true}).then((doctor)=>{
		return doctor.generateAuthToken().then((token)=>{
			const doctorData = {status:200, token:token, email:doctor.email, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id};
			res.status(200).send(doctorData);
		})
	}).catch((e)=>{
		console.log(e)
		res.status(403).send(e);
	})
}

exports.updateDoctor= (req, res, next)=>{
	const id = req.doctor.id;
	const doctor = new doctors({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		gender: req.body.gender,
		age: req.body.age,	
	});
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("err")
	}
	doctors.findByIdAndUpdate(id, {$set: {firstname:doctor.firstname, lastname:doctor.lastname,gender:doctor.gender, age:doctor.age}}, {new: true}).then((doctor)=>{
		if (!doctor) {
			const err ={status:403, message:"Unable to update"};
			return res.status(403).send(err);
		}
		req.data ={status:201,loggerUser:"Doctor", logsDescription:"Profile information update  Successful",title:"Profile update", _id:id}
		next();
	}).catch((e)=>{
		res.status(404).send("unable to update");
	})
}
/*
All doctors can be accessed by admins only.

*/
exports.doctors = (req, res, next) => {
    doctors.find().then((doctors)=>{
        if(!doctors) {
            const error = {status:403, message:"No doctors registered yet"}
            return res.status(403).send(error);
        }else {
            const allDoctors = {status:200, message:doctors}
            res.status(200).send(allDoctors);

        }
    }).catch((e)=>{
        res.status(403).send(e);
    })
}

exports.getAllDoctorsForMail=(req, res, next)=>{
    doctors.find().then((doctors)=>{
        if(!doctors) {
            const error = {status:403, message:"No doctors registered yet"}
            return res.status(403).send(error);
        }else {
            req.data.doctors = doctors;
            next();
        }
    }).catch((e)=>{
        console.log(e)
        res.status(403).send(e);
    })
}

exports.findDoctor = (req, res, next) => {
    const _id = req.params.id;
    //console.log(_id);
    doctors.findById(_id).then((doctor)=>{
        if(!doctors) {
            const error = {status:403, message:"No doctors registered yet"}
            return res.status(403).send(error);
        }else {
            const doctorData = {status:200, email:doctor.email, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id,}
            req.data = doctorData;
            req.data.loggerUser = "Doctor";
            req.data.logsDescription = "A patience have created a new session with you, get ready to save a life.";
            req.data.title = "Chat";
            req.data.topic = "New chat session"
            req.data.link = "medikcare.com/chat/patience/"+doctor._id;
            req.data.loggerUserTo = "USer";
            req.data.logsDescriptionTo = "You have started a medical consultation.";
            req.data._idTo = req.user._id;
                next();

        }
    }).catch((e)=>{
        res.status(403).send(e);
    })
}

exports.findDoctorByID = (req, res, next) => {
    const _id = req.body._doctorId;
    console.log(_id);
    doctors.findById(_id).then((doctor)=>{
        if(!doctors) {
            const error = {status:403, message:"No doctors registered yet"}
            return res.status(403).send(error);
        }else {
             req.data.email = doctor.email;
            req.data.name =doctor.firstname +" "+ doctor.lastname;
            req.data.playerId =doctor.playerId;
            req.data._id = doctor._id;
                next();
        }
    }).catch((e)=>{
        res.status(403).send(e);
    })
}
exports.findAdminDoctorByID = (req, res, next) => {
    const _id = req.params.id;

    doctors.findById({_id:_id}).then((doctor)=>{
        if(!doctors) {
            const error = {status:403, message:"No doctors registered yet"}
            return res.status(403).send(error);
        }else {
            return doctor.generateAuthToken().then((token)=>{
                req.data = {status:200, token:token, email:doctor.email, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id};
               next()
            })
        }
    }).catch((e)=>{
       // console.log(e)
        res.status(403).send(e);
    })
}
exports.findUserDoctorByID = (req, res, next) => {
    const _id = req.params.id;

    doctors.findById({_id:_id}).then((doctor)=>{
        if(!doctors) {
            const error = {status:403, message:"No doctors registered yet"}
            return res.status(403).send(error);
        }else {
            res.status(200).send({"status":200,"message": {email:doctor.email, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id}})
        }
    }).catch((e)=>{
       // console.log(e)
        res.status(403).send(e);
    })
}

exports.getDoctorsAnswers = (req, res)=>{
     req.data.answers.map(async (answer, index)=>{
       await doctors.find(answer._doctorId).then((doctors)=>{
            if(!doctors) {
                const error = {status:403, message:"No doctors Answers Yet"}
                return res.status(403).send(error);
            }else{
                 req.data.answers.doctor = doctor;
                 console.log(req.data);
                 res.status(200).send(req.data);
            }
        }).catch((e)=>{
            console.log(e)
            res.status(403).send(e);
        })
    })
 
}

exports.getDoctorsAnswers = (req, res)=>{
    try {
      const doc =  req.data.answers.map(async(answer)=>{
          const id = answer._id;
             return await doctors.find(id);
        });
        if(!doc) {
            const error = {status:403, message:"No doctors Answers Yet"}
            return res.status(403).send(error);
        }
        else{
            req.data.doctor = doc;
            res.status(200).send(req.data);
        }
    } catch (error) {
        console.log(error)
        res.status(403).send(error);
    }
}
exports.passwordChange =(req, res, next) =>{
	const email = req.doctor.email;
	const oldPassword = req.body.oldPassword;

	doctors.findByCredentials(email, oldPassword).then((doctor)=>{ 
		const doctorPassword = new doctors({
			password : req.body.newPassword,
		})
		doctors.findOneAndUpdate({_id:doctor._id}, {$set: {password:doctorPassword.password}}, {new:true}).then((doctor)=>{
				if(!doctor) {
					const err = {status:403, message:"unable to update password"}
					return res.status(403).send(err);
				}else {
					req.data ={status:201,loggerUser:"Doctor", logsDescription:"Password change Was Successful",title:"Password Change", _id:doctor._id}
					next();
				}
		})
	}).catch((e)=>{
		const error = {status:403, message:"Email or password do not exist"}
		res.status(403).send(error);
	})
}
exports.findAdminByMail = (req, res,next)=> {
	const email = req.body.email;

	doctors.findOne({email:email}).then((doctor)=> {
	if (!doctor) { 
		const err ={status:403, message:"No user with this id"};
		return res.status(403).send(err)
	}else {
		return doctor.generateAuthToken().then((token)=>{
			if(!token) {
				const err = {status:403, message:"unable to generate toke"}
				return res.status(403).send(err);
			}else{	
				req.data = {status:201,token:token, email:doctor.email, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id,  loggerUser:"Doctor", logsDescription:"There was a request to update your password. Please click the link below to get a new password",title:"New Password",link:`medikcare.com/doctor/forget-password/${token}`}
				next();
			}
		})
	}
	}).catch((e) => {
		return res.status(403).send(e);
	})
}
exports.newPasswordChange =(req, res, next) =>{
	const _id = req.doctor._id;
	doctors.findById({_id}).then((doctor)=>{ 
		const doctorPassword = new doctors({
			password : req.body.newPassword,
		})
		doctors.findOneAndUpdate({_id:_id}, {$set: {password:doctorPassword.password}}, {new:true}).then((doctor)=>{
				if(!doctor) {
					const err = {status:403, message:"unable to update password"}
					return res.status(403).send(err);
				}else {
					return doctor.generateAuthToken().then((token)=>{
						if(!token) {
							const err = {status:403, message:"unable to generate toke"}
							return res.status(403).send(err);
						}else{	
							req.data = {status:201,token:token, email:doctor.email, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id,  loggerUser:"Doctor", logsDescription:"Password change Was Successful",title:"New Password Change"}
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

exports.logout =(req, res, next)=>{
	const id = req.doctor._id;
	const doctorUpdate = new doctors({
		loginStatus: false,
	});
	doctors.findByIdAndUpdate(id, {$set: { loginStatus:doctorUpdate.loginStatus}}, {new: true}).then((doctor)=>{
		if (!doctor) {
			const error = {status:403, message:"Unable to logout."}
			res.status(403).send(error);
		}else {
			
			req.data = {status:201, title:"Logout", logsDescription:"Doctor logout", loggerUser:"Doctor", _id:id}
			next();
		}
	}).catch((e)=>{
		const error = {status:403, message:"Unable to logout."}
		res.status(403).send(error);
	})
}
exports.updatePersonNotification=(req, res)=>{
    const id = req.doctor._id;
    const playerId = req.params.playerId;
   doctors.findByIdAndUpdate(id, {$set: { playerId:playerId}}, {new: true}).then((doctor)=>{
       if (!doctor) {
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
 exports.notifyDoctor  = async (req, res)=>{
   console.log({"req.body":req.body})
    const _id = req.body.to;
    const mes = req.body.message;
   doctors.findById({_id}).then((doctor)=>{
       if (!doctor) {
           const error = {status:403, message:"Unable to find user id."}
           res.status(403).send(error);
       }else {
           console.log(doctor)
        playerId = doctor.playerId;		
        let appid = "49bc3735-1264-4e8a-a146-f4291107deba";
        const message = { 
        app_id: appid,
        contents: {"en": mes},
        include_player_ids: [playerId]
      };
        sendNotification(message);  
        res.status(200).send({status:201});
       }
   }).catch((e)=>{
       console.log(e)
       const error = {status:403, message:"Unable to find user."}
       res.status(403).send(error);
   }) 
 }

 exports.notifyDoctors = async (req, res)=>{
      const response= await req.data.doctors.map((doctor)=>{
        return doctor.playerId;  
      });
    	
      let appid = "49bc3735-1264-4e8a-a146-f4291107deba";
      const message = { 
      app_id: appid,
      contents: {"en": req.data.topic},
      include_player_ids: [response]
      }
      
      sendNotification(message); 
    
      res.status(201).send({status:201, message:"Your question has been sent to our docotrs."});
 }

  function sendNotification(data) {
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

  exports.getDoctorsMetric = (req, res, next)=>{
    doctors.countDocuments().then((count)=>{
      req.metric.doctorMetric =count;
      next();
    })
}