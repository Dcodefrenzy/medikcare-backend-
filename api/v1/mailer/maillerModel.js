const mongoose = require("mongoose");


let maillerSchema = new mongoose.Schema({
	topic: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
    },
    mailerSent:{
        type:Boolean,
        default:false
    },
    maillerNumber:{
        type:Number,
        default:0,
    },
	_createdBy: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: String,
		required: true,
	},
	_updatedBy: {
		type:String,
		required: false,
	},
	dateUpdated: {
		type:String,
		required: false,
	},
	deleteMessage: {
        type: Boolean,
        default:false,
	},
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	},
});


const maillers = mongoose.model('Maillers', maillerSchema);

module.exports = {maillers};