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
                    dateCreated:new Date(),
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
                    complains:req.body.complains,
                    medication:req.body.medication,
                    test:req.body.test,
                    diagnoses:req.body.diagnoses,
                    plan:req.body.plan,
                    appointmentDate:req.body.appointmentDate,
                    complete: true,
                    _doctorId: req.body._doctorId,
                    _userId: req.body._userId,
                    _sessionId:req.body.chatSessionId,
                    dateCreated:new Date(),
            });
            ReportsRecord.save().then((record)=>{
                console.log(record);
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
                plan:req.body.plan,
                complete: true,
                complains:req.body.complains,
                appointmentDate:req.body.appointmentDate,
        });
        ReportsRecords.findByIdAndUpdate({_id:report._id}, {$set: {complains:rec.complains,medication:rec.medication, test:rec.test, diagnoses:rec.diagnoses,complete:true}}, {new: true}).then((record)=>{
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

 exports.getUserReports = (req,res,next)=>{
    const _userId = req.user._id;
 
    ReportsRecords.find({_userId:_userId,complete:true}, null, {sort: {_id: -1}}).then((reports)=>{
        if (!reports) {
            res.status(404).send({status:404,message:"No reports"})
        }else if (reports.length < 1) {
            
            res.status(404).send({status:404,message:"No reports yet"})
        }else{
            req.data =  {status:200,message:reports};
            next();
        }
    }).catch((e)=>{
        console.log(e)
        res.status(404).send({status:404,message:"No reports"})
    })
}

exports.getUserReportsForDoctors = (req,res,next)=>{
    const _userId = req.params.id;
 
    ReportsRecords.find({_userId:_userId,complete:true}, null, {sort: {_id: -1}}).then((reports)=>{

            req.data.reports = reports;
            next();

    }).catch((e)=>{
        console.log(e)
        res.status(404).send({status:404,message:"No reports"})
    })
}

exports.getUserReportForDoctors = (req,res,next)=>{
    ReportsRecords.findOne({_sessionId:req.data.session._id}).then((report)=>{
            req.data.report = report;
        res.status(200).send(req.data)
    }).catch((e)=>{
        console.log(e)
        res.status(404).send({status:404,message:"No reports"})
    })
}

exports.getDoctorsReports =(req, res,next)=>{
    ReportsRecords.find({_doctorId:req.doctor._id}).then((reports)=>{
        if (reports) {
            req.data = {status:200, message:chats};
            next();
        }else{
            return res.status(403).send({status:403, message:"No previous session found"});
        }
        next();
    }).catch((e)=>{
        console.log(e)
        res.status(404).send({status:404,message:"No reports"})
    })
}


exports.getUserReport = (req, res, next)=>{
    const _id = req.params.id;
    ReportsRecords.findOne({ _id:_id}).then((report)=>{
        if (!report) {
            res.status(404).send({status:404,message:"No report"})
        }else{
            req.data =  {status:200,message:report};
            next();
        }
    }).catch((e)=>{
        console.log(e)
        res.status(404).send({status:404,message:"No reports"})
    })
}


exports.updateReport = (req, res, next)=>{
    const _sessionId = req.body._sessionId;
    const drugs = [{name:req.body.name, interval:req.body.interval, duration:req.body.duration}];
    ReportsRecords.findOne({_sessionId:_sessionId}).then((record)=>{
        if (record) {
            ReportsRecords.findOneAndUpdate({_sessionId:_sessionId}, {$set: {complains:req.body.complains, diagnoses:req.body.diagnoses, plan:req.body.plan, appointmentDate:req.body.appointmentDate, complete: true,}}, {new: true}).then((report)=>{  
            req.data = report;
            next();
            })
        }else{  
            ReportsRecord = new ReportsRecords({
                complains:req.body.complains,
                diagnoses:req.body.diagnoses,
                plan:req.body.plan,
                appointmentDate:req.body.appointmentDate,
                complete: true,
                _doctorId: req.body._doctorId,
                _userId: req.body._userId,
                _sessionId:req.body.chatSessionId,
                dateCreated:new Date(),
        });

        ReportsRecord.save().then((report)=>{
            req.data = report;
            next();
        })

        }
    }).catch((e)=>{
        console.log(e);
    })
}

exports.updateMedications = (req, res)=>{
    const _sessionId = req.body._sessionId;
    const drugs = [{name:req.body.name, interval:req.body.interval, duration:req.body.duration}];
    console.log(drugs)
    ReportsRecords.findOne({_sessionId:_sessionId}).then((record)=>{
        if (record) {
            ReportsRecords.findOneAndUpdate({_sessionId:_sessionId}, {$push: {drugs:drugs}}, {new: true}).then((report)=>{
                res.status(200).send({status:200, report:report});
            })
        }else{
            ReportsRecord = new ReportsRecords({
                drugs:drugs,
                complete: false,
                _doctorId: req.body._doctorId,
                _userId: req.body._userId,
                _sessionId:_sessionId,
                dateCreated:new Date(),
        });

        ReportsRecord.save().then((report)=>{
            res.status(200).send({status:200, report:report});
        })

        }
    }).catch((e)=>{
        console.log(e);
    })
}


exports.updateTest = (req, res)=>{
    const _sessionId = req.body._sessionId;
    const labTest = [{name:req.body.labTest}];
    ReportsRecords.findOne({_sessionId:_sessionId}).then((record)=>{
        if (record) {
            ReportsRecords.findOneAndUpdate({_sessionId:_sessionId}, {$push: {labTest:labTest}}, {new: true}).then((report)=>{
                res.status(200).send({status:200, report:report});
            })
        }else{
            ReportsRecord = new ReportsRecords({
                labTest:labTest,
                complete: false,
                _doctorId: req.body._doctorId,
                _userId: req.body._userId,
                _sessionId:_sessionId,
                dateCreated:new Date(),
        });

        ReportsRecord.save().then((report)=>{
            res.status(200).send({status:200, report:report});
        })

        }
    }).catch((e)=>{
        console.log(e);
    })
}

exports.deleteTest=(req, res)=>{
    const _sessionId= req.params.id;
    const labTestId = req.params.test;
    ReportsRecords.findOneAndUpdate({"_sessionId":_sessionId, "labTest._id":labTestId}, {$pull: {"labTest": {"_id": {$in:[labTestId]}}}}, {new: true}).then((report)=>{        
    if (!report) {
        res.status(404).send({status:404,message:"No report"});  
    }
        res.status(200).send({status:200, report:report});
    }).catch((e)=>{
        console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
    
}

exports.deleteMedication=(req, res)=>{
    const _sessionId= req.params.id;
    const medicationId = req.params.medication;
    ReportsRecords.findOneAndUpdate({"_sessionId":_sessionId, "drugs._id":medicationId}, {$pull: {"drugs": {"_id": {$in : [medicationId]}}}}, {new: true}).then((report)=>{
        if (!report) {
            res.status(404).send({status:404,message:"No report"});  
        }
        res.status(200).send({status:200, report:report});
    }).catch((e)=>{
        console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
    
}