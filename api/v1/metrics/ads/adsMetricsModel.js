const mongoose = require("mongoose");

AdsMetricsSchema = mongoose.Schema({
		socialMedia: {
			type:Number,
			trim: true,
			required: true,
		},
		description: {
			type:String,
			trim:true,
		},
		userType: {
			type: String,
			required:true,
		},
		dateCreated:{
			type: String,
			required: true,
		},
		_loggerId: {
			type: mongoose.Schema.Types.ObjectId,
			required:true,
			trim:true
		},
});


var AdsMetrics = mongoose.model("adsMetrics", AdsMetricsSchema );
module.exports = AdsMetrics;