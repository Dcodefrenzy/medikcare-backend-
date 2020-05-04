const chats = require("./chatModel");
const io = require("socket.io");




exports.createSession = (req, res, next)=>{
    const chat = new chats({
        sessionStart:false,
        sessionEnd:false,
        complain:req.body.complain,
        emergencyLevel:req.body.emergencyLevel,
        userId:req.user._id,
    });
    chat.save().then((chat)=>{
            const chatSession = {status:201,complain:chat.complain, _id:chat._id}
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

exports.updateStartSession =(req, res,next)=>{
    const _id = req.params.id;
    chats.findOneAndUpdate({userId:_id, sessionStart:false}, {$set: {sessionStart:true, sessionEnd:false}}, {new: true}).then((chat)=>{
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
    chats.findByIdAndUpdate(_id, {$set: {sessionEnd:true}}, {new: true}).then((chat)=>{
        //console.log(chat)
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


exports.getUserSessionForDoctors = (req, res, next) =>{
    const userId = req.params.id;
    chats.findOne({userId:userId, sessionEnd:false}).then((chat)=>{
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