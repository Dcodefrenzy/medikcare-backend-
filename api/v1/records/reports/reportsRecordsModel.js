const mongoose = require("mongoose");
const {users} = require("../../users/usersModel");

ReportsRecordsSchema = mongoose.Schema({
        complains:{
            type:String,
            required:false,
        },
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
        plan:{
            type:String,
            required:false,
        },
        appointmentDate:{
            type:Date,
            require:false,
        },
        drugs:[{
            name:{
                type:String,
                required:false,
            },
            interval:{
                type:Number,
                required:false,
            },
            duration:{
                type:Number,
                required:false,
            },
        }],
        labTest:[{
            name:{
                type:String,
            }
        }],
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