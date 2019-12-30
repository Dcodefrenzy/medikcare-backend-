const AdsMetrics = require("./adsmetricsModel.js");
const {ObjectID} = require("mongodb");




exports.addAdsMetricsUser = (req, res,next)=>{
	AdsMetric = new AdsMetrics({
			socialMedia: req.data.socialMedia,
			description: req.data.metricsDescription,
			userType: req.data.loggerUser,
			dateCreated: new Date,
			_loggerId: req.data._id,
	});
	AdsMetric.save().then((data)=>{
		if (!data) {
			return res.status(404).send("Unable to add ads metrics");
		}
		next();
	}).catch((e)=>{
		res.status(404).send("Unable to add ads metrics");
	});
}


/*exports.getAdMetricsForDoctors = (req, res)=>{

}*/


/*exports.getAdMetricsForUsers = (req, res)=>{
	
}*/

