const mongoose = require("mongoose");


logSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim:true,
		minlength:1,
	},
	description:{
		type:String,
		required:true,
		trim:true,
		minlength:1,
	},
	date: {
		type:String,
		required:true,
		trim:true,
		minlength:1,
	},
	loggerUser: {
		type: String,
		required: true,
	},
	status:{
		type:String,
		required:false,
		default:"Unread",
	},
	_loggerId: {
		type: mongoose.Schema.Types.ObjectId,
		required:true,
		trim:true,
	},
});

var Logs = mongoose.model('logs', logSchema);
module.exports = Logs