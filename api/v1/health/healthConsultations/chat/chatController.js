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
    chats.findByIdAndUpdate(_id, {$set: {sessionStart:true, sessionEnd:false}}, {new: true}).then((chat)=>{
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
    console.log(req.body.chatSessionId)
    const _id = req.body.chatSessionId;
    chats.findByIdAndUpdate(_id, {$set: {sessionEnd:true}}, {new: true}).then((chat)=>{
        
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
        console.log(chats);
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
    chats.findOne({userId:userId,sessionStart:false, sessionEnd:false}).then((chat)=>{
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