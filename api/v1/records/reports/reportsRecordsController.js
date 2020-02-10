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
                     req.data.link = "https://medikcare.com/reports/"+req.body._userId+"/"+req.body.chatSessionId;
                     req.data.topic = "Fill User Medical Report"; 
                     req.data.logsDescription = req.user.firstname+" "+req.user.lastname+" has ended a session with you and you were rated "+req.body.metric+" ("+req.body.metricTitle+"). Please click on the link below to fill the medical report. If you have already filled it you can ignore this request.";
                     req.data.loggerUser = "Doctor";
                     console.log(req.data.logsDescription)
                     next();
              }       
            })
            
        }else {
            req.data.loggerUser = "Doctor";
            req.data.link = "https://medikcare.com/reports/"+req.body._userId+"/"+req.body.chatSessionId;
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

exports.addCompleteReportRecord = (req, res, next)=>{
    ReportsRecords.findOne({_sessionId:req.body.chatSessionId}).then((report)=>{
        if (!report) {
            ReportsRecord = new ReportsRecords({
                    medication:req.body.medication,
                    test:req.body.test,
                    diagnoses:req.body.diagnoses,
                    complete: true,
                    _doctorId: req.body._doctorId,
                    _userId: req.body._userId,
                    _sessionId:req.body.chatSessionId,
            });
            ReportsRecord.save().then((record)=>{
                if (!record) {
                     
			const error = {status:404, message:"Unable to add report."}
			return res.status(404).send(error); 
                }else if (record) {
                    req.data = {}
                    req.data.link = "https://medikcare.com/chat/feedback/"+req.doctor._id+"/"+req.body.chatSessionId;
                     req.data.topic = "Your Medical Report Is Ready"; 
                     req.data.logsDescription = "Dr "+req.doctor.firstname+" "+req.doctor.lastname+" has ended a medical session with you and has filled your medical report. Please check your dashboard to see your doctor's report. Also, Please click on the link below to share your experince using oursite thank. If you have already filled it you can ignore this request.";
                     req.data.loggerUser = "User";	
                     req.data.status = 201;
                     req.data._idTo = req.doctor._id;
                     req.data.loggerUserTo = "User";
                     req.data.logsDescriptionTo = "User has Ended Consultation";
                     next();
              }       
            })
            
        }else {
         rec   = new ReportsRecords({
                medication:req.body.medication,
                test:req.body.test,
                diagnoses:req.body.diagnoses,
                complete: true,
        });
        ReportsRecords.findByIdAndUpdate({_id:report._id}, {$set: {medication:rec.medication, test:rec.test, diagnoses:rec.diagnoses,complete:true}}, {new: true}).then((record)=>{
                if (!record) {
			        const error = {status:404, message:"Unable to add report."}
			        return res.status(404).send(error); 
                }else{
                   req.data = {}
                    req.data.link = "https://medikcare.com/chat/feedback/"+req.doctor._id+"/"+req.body.chatSessionId;
                    req.data.topic = "Your Medical Report Is Ready"; 
                    req.data.logsDescription = "Dr "+req.doctor.firstname+" "+req.doctor.lastname+" has ended a medical session with you and has filled your medical report. Please check your dashboard to see your doctor's report. Also, Please click on the link below to share your experince using oursite thank. If you have already filled it you can ignore this request.";
                    req.data.loggerUser = "Doctor";		
                    req.data.status = 201;
                    req.data._idTo = req.doctor._id;
					req.data.loggerUserTo = "User";
					req.data.logsDescriptionTo = "User has Ended Consultation";
                    req.data.title = "Chat";
                    next();
                }
            })

        }
    }).catch((e)=>{
        console.log(e)
        let err ={}
        if(e.errors) {err = {status:403, message:e.errors}}
        else if(e){err = {status:403, message:e}}
        res.status(403).send(err);
    });


}

