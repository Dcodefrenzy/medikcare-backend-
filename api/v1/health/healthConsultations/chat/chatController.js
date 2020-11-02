const chats = require("./chatModel");
const io = require("socket.io");




exports.createSession = (req, res, next)=>{
    const chat = new chats({
        sessionStart:false,
        sessionEnd:false,
        complain:req.body.complain,
        emergencyLevel:req.body.emergencyLevel,
        userId:req.user._id,
        means:req.body.means,
    });
    chat.save().then((chat)=>{
            const chatSession = {status:201,complain:chat.complain, _id:chat._id,means:chat.means}
        req.data = chatSession;
		req.data.loggerUser = "User";
		req.data.logsDescription = `You started a session`;
        req.data.title = "Chat";
        
        next();
    }).catch((e)=>{
        console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
}


 exports.appointmentSession = async(appointments)=>{
       const allSession = appointments.map(async(appointment)=>{
            const chat = new chats({
                sessionStart:false,
                sessionEnd:false,
                complain:"This consultation is a follow up consultation.",
                emergencyLevel:1,
                userId:appointment.user._id,
            });
            const session = await chat.save();
            return sessionAppointments = {appointment:appointment.appointment, user:appointment.user, doctor:appointment.doctor, session:session}
        })
        const sessions = await Promise.all(allSession);
        return sessions;
}

exports.updateStartSession =(req, res,next)=>{
    const userId = req.params.id;
    const _id = req.params.sessionId;
    chats.findOneAndUpdate({_id:_id, userId:userId, sessionStart:false}, {$set: {sessionStart:true, sessionEnd:false}}, {new: true}).then((chat)=>{
        req.data.status = 201;
        req.data._id = _id;
        req.data.loggerUser = "User";
        req.data.logsDescription = `Doctor ${req.doctor.firstname+" "+req.doctor.lastname} have created a new session with you, to join please login with the link below.`;
        req.data.title = "Chat";
        req.data.topic = "New Medical session"
        req.data.link = "medikcare.com/chat/doctors";
        req.data.loggerUserTo = "Doctor";
        req.data.logsDescriptionTo = "You have started a medical consultation.";
        req.data._idTo = req.doctor._id;
            next();
    }).catch((e)=>{
        console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
 
}
exports.updateEndSession =(req, res,next)=>{
    const _id = req.body.chatSessionId;
    console.log(_id)
    chats.findByIdAndUpdate(_id, {$set: {sessionEnd:true}}, {new: true}).then((chat)=>{
        if (!chat) {
            console.log("here")
            return res.status(403).send({status:403, message:"No chat found"});
        }
        req.data = chat;
        req.data.title = "Medical chat Session Ended"
         req.data.link = "https://medikcare.com/chat/feedback/"+req.doctor._id+"/"+req.body.chatSessionId;
         req.data.topic = "Your Medical Report Is Ready"; 
         req.data.logsDescription = "Dr "+req.doctor.firstname+" "+req.doctor.lastname+" has ended a medical session with you and has filled your medical report. Please check your dashboard to see your doctor's report. Also, Please click on the link below to share your experince using oursite thank. If you have already filled it you can ignore this request.";
         req.data.loggerUser = "Doctor";		
         req.data.status = 201;
         req.data._idTo = req.body._userId;
         req.data.loggerUserTo = "User";
         req.data.logsDescriptionTo = "Doctor has Ended Consultation, please check your medical report";
         req.data.title = "Chat";
         next();


    }).catch((e)=>{
        console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
 
}

exports.getSessions = (req, res, next) =>{
    chats.find({sessionStart:false, sessionEnd:false}, null, {sort: {_id: -1}}).then((chats)=>{
            if (chats) {
                req.data = {status:200, message:chats};
                next();
            }else{
                return res.status(403).send({status:403, message:"No chats found"});
            }
    }).catch((e)=>{
        console.log(e)
		res.status(403).send("No chats found");
	});
}
//
exports.getSessionForAdmin = (req, res,next)=>{
    chats.findOne({$or: [ {userId:req.body.from, sessionEnd:false, sessionStart:true}, {userId:req.body.to, sessionEnd:false, sessionStart:true}]}).then((session)=>{
       if (session) {
            req.data.chatSession = req.body;
           req.data.session = session;
	    res.status(200).send({status:200,message:req.data});
       }else{
        
        req.data.session = "No Session here";
        req.data.chatSession = req.body;
        res.status(200).send({status:403,message:req.data});
       }
    })

}

exports.adminRevertSession = (req, res, next)=>{
    chats.findByIdAndUpdate({_id:req.body.id}, {$set: {sessionEnd:req.body.end, sessionStart:req.body.start}}, {new: true}).then((session)=>{
        if (session) {
                req.data = {"status":201, message:session};
                if (session.sessionEnd === false) {
                req.data.topic = "Reverting An Ongoing Medical Session"
                req.data.logsDescription = `A session with the complains ${session.complain} was reverted back to the doctors waiting list and will be attended to by our pool of doctors, Thank you.`;
                }else{   
                req.data.topic = "Ending A Medical Session"
                req.data.logsDescription = `A session with the complains ${session.complain} was Ended by Medikcare Admin, please login in ifyou want to start a new session, Thank you.`;
                }
                req.data.email = req.body.usermail+","+req.body.doctormail;
                req.data.name = "User";
               
                req.data._id = req.admin._id;
                req.data.loggerUser = "Admin";
                req.data.title = "Chat Session";
                req.data.link = "medikcare.com/";
                next();
        } else {
            res.status(403).send({status:403});
        }
    })
}

exports.getUserSession = (req, res, next) =>{
    const userId = req.params.id;
    chats.findOne({userId:userId,sessionStart:false, sessionEnd:false}).then((chat)=>{
            if (chat) {
                res.status(200).send({status:200, message:chat});
               
            }else{
                return res.status(403).send({status:403, message:"No chats found"});
            }
    }).catch((e)=>{
        console.log(e)
		res.status(403).send("No chats found");
	});
}

exports.fetchUserSession = (req, res, next) =>{
    const userId = req.user._id;
    chats.find({userId:userId, sessionStart:true, sessionEnd:false}).sort({_id:-1}).limit(1).then((chat)=>{
        req.session  = chat[0];
        next(); 
    }).catch((e)=>{
        console.log(e)
		res.status(403).send("No chats found");
	});
}

exports.getUserSessionForUpdate = (req, res, next)=>{
    const userId = req.params.id;
    chats.findOne({userId:userId, sessionEnd:false}).then((chat)=>{
            if (chat) {
                req.data.session = chat
                next();
               
            }else{
                return res.status(403).send({status:403, message:"No chats found"});
            }
    }).catch((e)=>{
        console.log(e)
		res.status(403).send("No chats found");
	});
}

exports.getUserSessionForDoctors = (req, res, next) =>{
    const userId = req.params.id;
    const _id = req.params.sessionId;
    console.log(_id)
    chats.findOne({_id:_id, userId:userId, sessionEnd:false}).then((chat)=>{
            if (chat) {
                req.data.message = chat
                res.status(200).send(req.data);
               
            }else{
                return res.status(403).send({status:403, message:"No chats found"});
            }
    }).catch((e)=>{
        console.log(e)
		res.status(403).send("No chats found");
	});
}

exports.getWaitingListMetrics=(req, res, next)=>{
	chats.countDocuments({sessionStart:false}).then((count)=>{
		req.metric.waitingListMetrics = count;
		next();
	})
}


exports.getOngoingSessions=(req, res, next)=>{
	chats.countDocuments({sessionStart:true, sessionEnd:false}).then((count)=>{
		req.metric.ongoingSessionsMetrics = count;
		next();
	})
}

exports.getEndedSession=(req, res, next)=>{
	chats.countDocuments({sessionStart:true, sessionEnd:true}).then((count)=>{
		req.metric.endedSessionMetrics = count;
		next();
	})
}

exports.updateAppointmentSession =(req, res,next)=>{
    console.log(req.data)
    const user = req.data.user;
    chats.findOneAndUpdate({_id:req.data.appointment.sessionId}, {$set: {sessionStart:true, sessionEnd:false}}, {new: true}).then((chat)=>{
        req.data.status = 201;
        req.data._id = req.data.appointment.user;
        req.data.loggerUser = "User";
        req.data.logsDescription = `A follow up session have been created for you.`;
        req.data.title = "Chat";
        req.data.topic = "New Medical session"
        req.data.link = "medikcare.com/chat/doctors";
        req.data.loggerUserTo = "Doctor";
        req.data.logsDescriptionTo = "A follow up medical consultation have been started for you.";
        req.data._idTo = req.data.appointment.doctor;
            next();
    }).catch((e)=>{
        console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
 
}


exports.getAllDoctorsSessions = async(req, res,next)=>{
req.newData = [];
	let newData;
	newData = await req.data.map(async(data, index)=>{
        const users = JSON.parse(data.users);
   chatSessions = await  chats.find({userId:users._id}).sort({_id:-1}).limit(1);
        
    req.newData.push({ sessions: JSON.parse(data.sessions), users:JSON.parse(data.users), chatSessions: JSON.stringify(chatSessions[0]) });
});
    const resp = await Promise.all(newData);
    if (resp) {
        next();
    }
}