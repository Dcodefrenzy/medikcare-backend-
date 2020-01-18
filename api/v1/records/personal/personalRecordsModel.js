const mongoose = require("mongoose");
const {users} = require("../../users/usersModel");

PersonalRecordsSchema = mongoose.Schema({
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
			type: String,
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
			ref:users,
		},
});


var PersonalRecords = mongoose.model("personalRecords", PersonalRecordsSchema);
module.exports = PersonalRecords;