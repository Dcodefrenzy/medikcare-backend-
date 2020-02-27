const ChatMetrics = require("./chatMetricModel");
const {ObjectID} = require("mongodb");




exports.addChatMetricsUser = (req, res,next)=>{
	            
	if (req.user._id !== req.body._userId) {
		const error = {status:401, message:"You are trying to enter a report thats not yours."}
		return res.status(401).send(error); 
	}
	ChatMetrics.findOne({_sessionId:req.body.chatSessionId}).then((metric)=>{
		if (!metric) {
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
		})
		}else{
			res.status(200).send({status:200});
		}
	})
	.catch((e)=>{
		//console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
}


