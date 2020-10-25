const express = require('express');
const {mongoose} = require("../../../db/mongoose");
const {ObjectID} = require('mongodb');
const {doctors} = require("./doctorsModel");
const multer = require('multer');
const path = require('path');
require('dotenv').config()
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client(process.env.OnesignalAppId, process.env.OnesignalApi);

let imgPath;
if ( process.env.DEV_ENV) {
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
    
        const doctor = new doctors({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phonenumber: req.body.phonenumber,
            gender: req.body.gender,
            age: "N/A",
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
                console.log("Added dotors data and created a token");
                next();
            })
        }).catch((e)=>{
            console.log(e)
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

exports.deleteDoctor = (req, res, next)=>{
    const id = req.params.id;
   // console.log(id)
	doctors.findByIdAndUpdate(id, {$set: {deletedBy:req.admin._id, deleteUser:req.body.deleteUser}}, {new: true}).then((doctor)=>{
			const doctorData = {status:201, email:doctor.email, name:doctor.firstname +" "+ doctor.lastname,_id:req.admin._id, _doctorId:doctor._id};
            req.data = doctorData;
            req.data.loggerUser = "Admin";
            req.data.logsDescription = "Doctor "+ doctorData.name+" was deleted by "+req.admin.firstname+" "+req.admin.lastname;
            req.data.title = "Delete";
 
            next();

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
    doctors.find({deleteUser:false}).then((doctors)=>{
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

exports.Userdoctors = (req, res, next) => {
    doctors.find({deleteUser:false}).then((doctors)=>{
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
    doctors.find({deleteUser:false}).then((doctors)=>{
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


exports.getDoctorsForAppointment = async(appointments)=>{
	let newData;
	 newData = await appointments.map(async(appointment, index)=>{

	const doctor = await  doctors.findById({_id:appointment.appointment.doctor});
	return nData = {appointment:appointment.appointment, user:appointment.user, doctor:doctor};
});

const resp = await Promise.all(newData);
return resp
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
            req.data.logsDescription = "A patient have created a new session with you, please treat as urgent.";
            req.data.title = "Chat";
            req.data.topic = "New chat session"
            req.data.link = "medikcare.com/chat/doctors/doctor";
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

    let _id;
        if (!req.data) {
            _id = req.body._doctorId;
        }else if (req.data) {
            _id = req.data.appointment.doctor;
        }
    
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
                req.data = {status:200, token:token, email:doctor.email, name:doctor.firstname +" "+ doctor.lastname, _id:doctor._id, isDoctor:true};
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
            res.status(200).send({"status":200,"message": {email:doctor.email, name:"DR. "+doctor.firstname +" "+ doctor.lastname, _id:doctor._id}})
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

exports.getDoctorsSession=async(req, res,next)=>{
    
	let newData;
    
     newData = await req.data.map(async(data, index)=>{
            const sessions = JSON.parse(data.sessions);
            const users = JSON.parse(data.users);
            const doctor = await doctors.findOne({$or: [ {_id:sessions.from}, {_id:sessions.to}]});
            return ndata = {sessions:sessions, users:users, doctors:doctor};
	});
	const resp = await Promise.all(newData);
	if(resp){
		res.status(200).send({status:200, message:resp});
	}
}
exports.viewDoctorByIds = async(req, res)=>{
	const newData = await req.data.message.map(async(data, index)=>{
		const doctor = await doctors.findById({_id:data. _doctorId});
		
         data._doctorId = doctor.firstname +" "+ doctor.lastname;
         return  data;

	});
	const resp = await Promise.all(newData);
	if(resp){
		res.status(200).send(req.data);
	}
}
exports.viewDoctorNameById = (req, res)=>{
	doctors.findById({_id:req.data.message._doctorId}).then((doctor)=>{
        if (doctor) {
		req.data.doctor = doctor.firstname+" "+doctor.lastname;
		res.status(200).send(req.data);
        }
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
exports.notifyDoctorAppointment = async(req, res)=>{
    const playerId = req.data.playerId;
    const mes = req.data.logsDescription;
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
 exports.notifyDoctor  = async (req, res)=>{
    const _id = req.body.to;
    const mes = req.body.message;
   doctors.findById({_id}).then(async(doctor)=>{
       if (!doctor) {
           const error = {status:403, message:"Unable to find user id."}
           res.status(403).send(error);
       }else {
            playerId = doctor.playerId;		
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
    	
     
      const message = { 
      contents: {"en": req.data.topic},
      include_player_ids: [response]
      }
      
      client.createNotification(message)
      .then(res => {
          console.log(res);
        res.status(200).send({status:200, message:"Your question has been sent to our docotrs."});
      }).catch(e => {
          console.log(e)
      });
    
    
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
    doctors.countDocuments({deleteUser:false}).then((count)=>{
      req.metric.doctorMetric =count;
      next();
    })
}


exports.doctorChatSession = (req, res, next)=>{
    
	doctors.findOne({$or: [ {_id:req.body.from}, {_id:req.body.to}]}).then((doctor)=>{
        //console.log({"doctor":doctor})
		if (doctor) {
        req.data.doctor = {_id:doctor._id, name:doctor.firstname+" "+doctor.lastname, email:doctor.email};
        next();
        } else {
            req.data.doctor = "No doctor";
            next();
        }

	});
}