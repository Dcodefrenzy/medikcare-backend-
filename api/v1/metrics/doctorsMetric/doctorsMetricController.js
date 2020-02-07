const doctorMetrics = require("./doctorsMetricModel");
const {ObjectID} = require("mongodb");




exports.addDoctorMetricsUser = (req, res,next)=>{
	doctorMetric = new doctorMetrics({
			metric: req.body.docMetric,
			metricTitle:req.body.docMetricTitle,
            userType: req.body.userType,
			_sessionId:req.body.chatSessionId,
			_loggerId: req.user._id,
	});
	doctorMetric.save().then((data)=>{
		if (!data) {
			const err = {status:404, message:"unable to add chat metrics"}
			return res.status(404).send(err);
        }
                 const userData = {status:201, _idTo:req.user._id};		
                    req.data = userData;
					req.data.loggerUserTo = "User";
					req.data.logsDescriptionTo = "User has Ended Consultation";
                    req.data.title = "Chat";
                   
        
		next();
	}).catch((e)=>{
        //console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
}



