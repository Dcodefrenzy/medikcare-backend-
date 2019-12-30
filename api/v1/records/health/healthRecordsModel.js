const mongoose = require("mongoose");

HealthRecordsSchema = mongoose.Schema({
		genotype: {
			type:String,
			required: false,
		},
		bloodGroup: {
			type:String,
			required: false,
		},
		healthMetrics: [{
			height: {
				type:Number,
				required: false,
			},
			weight: {
				type:Number,
				required: false,
			},
			bloodPressure: {
				type:Number,
				required: false,
			}, 
		}],
		medicalConditions: [{
			medicalCondition: {
				type: String,
				required: false,
			},
		}],
		allergies: [{
			allergie: {
				type:String,
				required: false,
			},
		}],
		medications: [{
			medication: {
				type: String,
				required: false,
			},
		}],
		dateCreated:{
			type: String,
			required: true,
		},
		_userId: {
			type: mongoose.Schema.Types.ObjectId,
			required:true,
		},
});


var HealthRecords = mongoose.model("healthRecords", HealthRecordsSchema );
module.exports = HealthRecords;