const mongoose = require("mongoose");

ChatMetricsSchema = mongoose.Schema({
		metric: {
			type:Number,
			trim: true,
			required: true,
		},
		metricTitle: {
			type:String,
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
			default:Date.now,
		},
		_loggerId: {
			type: mongoose.Schema.Types.ObjectId,
			required:true,
			trim:true
		},
        _sessionId:{
            type: mongoose.Schema.Types.ObjectId,
            require:true,
        },
});


var chatMetrics = mongoose.model("chatMetrics", ChatMetricsSchema );
module.exports = chatMetrics;