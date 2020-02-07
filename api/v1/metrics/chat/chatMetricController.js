const ChatMetrics = require("./chatMetricModel");
const {ObjectID} = require("mongodb");




exports.addChatMetricsUser = (req, res,next)=>{
	
	ChatMetric = new ChatMetrics({
			metric: req.body.metric,
			metricTitle:req.body.metricTitle,
			description: req.body.description,
			userType: req.body.userType,
			_sessionId:req.body.chatSessionId,
			_loggerId: req.user._id,
	});
	ChatMetric.save().then((data)=>{
		if (!data) {
			const err = {status:404, message:"unable to add chat metrics"}
			return res.status(404).send(err);
		}
		next();
	}).catch((e)=>{
		//console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
}



