const AdsMetrics = require("./adsMetricsModel.js");
const {ObjectID} = require("mongodb");




exports.addAdsMetricsUser = (req, res,next)=>{
	AdsMetric = new AdsMetrics({
			socialMedia: req.data.socialMedia,
			description: "This account was refered from "+req.data.socialMedia,
			userType: req.data.loggerUser,
			dateCreated: new Date,
			_loggerId: req.data._id,
	});
	AdsMetric.save().then((data)=>{
		if (!data) {
			const err = {status:404, message:"unable to add ads metrics"}
			return res.status(404).send(err);
		}
		next();
	}).catch((e)=>{
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
}


/*exports.getAdMetricsForDoctors = (req, res)=>{

}*/


/*exports.getAdMetricsForUsers = (req, res)=>{
	
}*/

