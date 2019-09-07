const PersonalRecords = require("./personalRecordsModel.js");
const {ObjectID} = require("mongodb");




exports.addPersonalRecords = (req, res, next)=>{
	PersonalRecord = new PersonalRecords({
			dateCreated: new Date,
			_userId: req.data._id,
	});

	PersonalRecord.save().then((record)=>{
		if (!record) {
			//create an HTTP request using fetch Api to delete the user account that was un able to add.
			return res.status(404).send("Unable to add personal Record");
		}
		next();
	}).catch((e)=>{
		res.status(500).send("Unable to add personal Record");
	});
}

/*exports.getPersonalRecords = (req, res)=>{
	
}*/

/*exports.UpdatePersonalRecords = (req, res)=>{

}*/


