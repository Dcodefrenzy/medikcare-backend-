const mongoose = require("mongoose");


let blogSchema = new mongoose.Schema({
	topic: {
		type: String,
		required: true,
	},
	article: {
		type: String,
		required: true,
	},
	videoLink: {
		type:String
	},
	category: {
		type: Number,
		required: true,
	},
	image: {
		filename:{
			type:String,
			required:false,
		},
		path:{
			type:String,
			required:false,
		}
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
	deleteArticle: {
        type: Boolean,
        default:true,
	},
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	},
});


const blogs = mongoose.model('Blogs', blogSchema);

module.exports = {blogs};