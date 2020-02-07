const mongoose = require("mongoose");

DoctorsMetricsSchema = mongoose.Schema({
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


var doctorMetrics = mongoose.model("doctorMetrics", DoctorsMetricsSchema);
module.exports = doctorMetrics;