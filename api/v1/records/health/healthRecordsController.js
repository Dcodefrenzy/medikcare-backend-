const HealthRecords = require("./healthRecordsModel.js");
const {ObjectID} = require("mongodb");




exports.addHealthRecords = (req, res, next)=>{
	healthRecord = new HealthRecords({
			dateCreated: new Date,
			_userId: req.data._id,
	});
	healthRecord.save().then((record)=>{
		if (!record) {
		//create an HTTP request using fetch Api to delete the user account and personal acc that was un able to add.

			const err = {status:404, message:"unable to add health record"}
			return res.status(404).send(err);
		}
		next();
	}).catch((e)=>{
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
}

/*exports.getHealthRecords = (req, res)=>{
	
}*/

/*exports.UpdateHealthRecords = (req, res)=>{

}*/


