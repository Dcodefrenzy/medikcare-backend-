const ReportsRecords = require("./reportsRecordsModel");
const {ObjectID} = require("mongodb");




exports.addIncompleteReportRecord = (req, res, next)=>{
    ReportsRecords.findOne({_sessionId:req.body.chatSessionId}).then((report)=>{
        if (!report) {
            ReportsRecord = new ReportsRecords({
                    complete: false,
                    _doctorId: req.body._doctorId,
                    _userId: req.body._userId,
                    _sessionId:req.body.chatSessionId,
            });
            ReportsRecord.save().then((record)=>{
                if (!record) {
                     
			const error = {status:404, message:"Unable to add report."}
			return res.status(404).send(error)
                }else if (record) {
                     req.data.link = "https://medikcare.com/reports/id"+req.body._userId+"/"+req.body.chatSessionId;
                     req.data.topic = "Fill User Medical Report"; 
                     req.data.logsDescription = req.user.firstname+" "+req.user.lastname+" has ended a session with you and you were rated "+req.body.metric+" ("+req.body.metricTitle+"). Please click on the link below to fill the medical report. If you have already filled it you can ignore this request.";
                     req.data.loggerUser = "Doctor";
                     console.log(req.data.logsDescription)
                     next();
              }       
            })
            
        }else {
            req.data.loggerUser = "Doctor";
            req.data.link = "https://medikcare.com/reports/id"+req.body._userId+"/"+req.body.chatSessionId;
            req.data.topic = "Fill User Medical Report"; 
            req.data.logsDescription = req.user.firstname+" "+req.user.lastname+" has ended a session with you and you were rated "+req.body.metric+" out of 5 stars. Patient Commented that the session was: "+req.body.metricTitle+". Please click on the link below to fill the medical report. If you have already filled it you can ignore this request";
            console.log(req.data.logsDescription)
            next();
        }
    }).catch((e)=>{
        console.log(e)
        let err ={}
        if(e.errors) {err = {status:403, message:e.errors}}
        else if(e){err = {status:403, message:e}}
        res.status(403).send(err);
    });


}

exports.getPersonalRecords = (req, res)=>{
	_userId = req.user._id;
	PersonalRecords.findOne({_userId:_userId}).then((PersonalRecord)=>{
		if(!PersonalRecord) {
			const error = {status:404, message:"No User record Found"}
			return res.status(404).send(error)
		}
		user = {status:200, PersonalRecord:PersonalRecord, message:req.user };
		res.status(200).send(user);
		
	}).catch((e)=>{
		res.status(404).send(e)
	})
}

exports.UpdatePersonalRecords = (req, res, next)=>{
	const _userId = req.user._id;

	PersonalRecord = new PersonalRecords({
		status:  req.body.status,
		address: req.body.address,
		kinName: req.body.kinName,
		kinNumber:  req.body.kinNumber,
	})

	PersonalRecords.findOneAndUpdate({_userId:_userId}, {$set: {address:PersonalRecord.address, status:PersonalRecord.status, kinName:PersonalRecord.kinName,kinNumber:PersonalRecord.kinNumber}}, {new: true}).then((personalRecord)=> {
		if (!personalRecord) {
			const err ={status:403, message:"Unable to update"};
			return res.status(403).send(err);	
		}
		req.data ={status:201,loggerUser:"User", logsDescription:"Personal information update  Successful",title:"Personal information update", _id:_userId}
		next();
	}).catch((e)=>{
		console.log(e)
		return res.status(403).send(e);
	})
}


