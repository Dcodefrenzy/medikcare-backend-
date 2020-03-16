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
        dateCreated:{
            type: String,
            required:true,
        },
});


var ReportsRecords = mongoose.model("reportsRecords", ReportsRecordsSchema);
module.exports = ReportsRecords;