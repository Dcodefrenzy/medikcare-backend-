const mongoose = require("mongoose");


let blogImageSchema = new mongoose.Schema({

	filename:{
		type:String,
		required:false,
	},
	path:{
		type:String,
		required:false,
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
        required:false
	},
	dateUpdated: {
        type:String,
        required:false,
	},
	deleteImage: {
        type: Boolean,
        default:false,
	},
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	},
});


const blogImages = mongoose.model('blogImageSchema', blogImageSchema);

module.exports = {blogImages};