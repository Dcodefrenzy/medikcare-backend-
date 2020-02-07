const mongoose = require("mongoose");
const {users} = require("../../users/usersModel");

ReportsRecordsSchema = mongoose.Schema({
		medication: {
			type: String,
			required: false,
        },
        test:{
            type:String,
            require:false,
        },
        diagnoses:{
			type: String,
			required: false,
        },
		dateCreated:{
			type: String,
            required: true,
            default:Date.now,
        },
        complete:{
            type:Boolean,
            required:true,
        },
		_userId: {
			type: mongoose.Schema.Types.ObjectId,
			required:true,
			ref:users,
        },
		_doctorId: {
			type: mongoose.Schema.Types.ObjectId,
			required:true,
			ref:users,
        },
        _sessionId:{
            type: mongoose.Schema.Types.ObjectId,
            require:true,
        },
});


var ReportsRecords = mongoose.model("reportsRecords", ReportsRecordsSchema);
module.exports = ReportsRecords;