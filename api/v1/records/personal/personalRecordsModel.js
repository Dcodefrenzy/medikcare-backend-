const mongoose = require("mongoose");

PersonalRecordsSchema = mongoose.Schema({
		image: {
			type:String,
			required: false,
		},
		country: {
			type:Number,
			required: false,
		},
		state: {
			type: Number,
			required: false,
		},
		localGovernment: {
			type: Number,
			required: false,
		},
		address: {
			type: String,
			required: false,
		},
		status: {
			type: Number,
			required: false,
		},
		kinName: {
			type: String,
			required: false,
		},
		kinNumber: {
			type: Number,
			required: false,
		},
		dateCreated:{
			type: String,
			required: true,
		},
		_userId: {
			type: mongoose.Schema.Types.ObjectId,
			required:true,
		},
});


var PersonalRecords = mongoose.model("personalRecords", PersonalRecordsSchema);
module.exports = PersonalRecords;