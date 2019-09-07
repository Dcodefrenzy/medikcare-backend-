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
			return res.status(404).send("Unable to add health Record");
		}
		next();
	}).catch((e)=>{
		res.status(500).send(e);
	});
}

/*exports.getHealthRecords = (req, res)=>{
	
}*/

/*exports.UpdateHealthRecords = (req, res)=>{

}*/


