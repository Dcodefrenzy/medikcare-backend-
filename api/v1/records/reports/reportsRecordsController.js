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
                    dateCreated:Date.now()
            });
            
            if (req.user._id !== ReportsRecord._userId) {
                const error = {status:401, message:"You are trying to enter a report thats not yours."}
                return res.status(401).send(error); 
            }
            ReportsRecord.save().then((record)=>{
                if (!record) {
                     
			const error = {status:404, message:"Unable to add report."}
			return res.status(404).send(error)
                }else if (record) {
                     req.data.link = "https://medikcare.com/reports/"+req.body._userId+"/"+req.body.chatSessionId;
                     req.data.topic = "Fill User Medical Report"; 
                     req.data.logsDescription = req.user.firstname+" "+req.user.lastname+" has ended a session with you and you were rated "+req.body.metric+" ("+req.body.metricTitle+"). Please click on the link below to fill the medical report. If you have already filled it you can ignore this request.";
                     req.data.loggerUser = "Doctor";
                     next();
              }       
            })
            
        }else {
            req.data.loggerUser = "Doctor";
            req.data.link = "https://medikcare.com/reports/"+req.body._userId+"/"+req.body.chatSessionId;
            req.data.topic = "Fill User Medical Report"; 
            req.data.logsDescription = req.user.firstname+" "+req.user.lastname+" has ended a session with you and you were rated "+req.body.metric+" out of 5 stars. Patient Commented that the session was: "+req.body.metricTitle+". Please click on the link below to fill the medical report. If you have already filled it you can ignore this request";
           
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
                    dateCreated:Date.now()
            });
            console.log(ReportsRecord._doctorId);
            console.log(req.doctor._id)
            if (req.doctor._id != ReportsRecord._doctorId) {
                const error = {status:401, message:"You are trying to enter a report thats not yours."}
                return res.status(401).send(error); 
            }
            ReportsRecord.save().then((record)=>{
                if (!record) {
                     
			const error = {status:404, message:"Unable to add report."}
			return res.status(404).send(error); 
                }else if (record) {
                    req.data = {}
                    req.data.title = "Medical chat Session Ended"
                    req.data.link = "https://medikcare.com/chat/feedback/"+req.doctor._id+"/"+req.body.chatSessionId;
                    req.data.title = "Medical chat Session Ended"
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
            
        }else if(report.complete === true) {
            res.status(200).send({status:200});
        } else {
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
                   req.data.title = "Medical chat Session Ended"
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

 exports.getUserReports = (req,res)=>{
    const _userId = req.user._id;
 
    ReportsRecords.find({_userId:_userId,complete:true}, null, {sort: {_id: -1}}).then((reports)=>{
        if (!reports) {
            res.status(404).send({status:404,message:"No reports"})
        }else if (reports.length < 1) {
            
            res.status(404).send({status:404,message:"No reports yet"})
        }else{
            res.status(200).send({status:200,message:reports});
        }
    }).catch((e)=>{
        console.log(e)
        res.status(404).send({status:404,message:"No reports"})
    })
}
