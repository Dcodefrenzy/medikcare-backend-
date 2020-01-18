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
				const err = {status:404, message:"unable to add personal record"}
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

exports.getPersonalRecords = (req, res)=>{
	_userId = req.user._id;
	PersonalRecords.findOne({_userId:_userId}).then((PersonalRecord)=>{
		if(!PersonalRecord) {
			const error = {status:404, message:"No User record Found"}
			return res.status(404).send(error)
		}
		user = {status:200, PersonalRecord:PersonalRecord, message:req.user };
		res.status(200).send(user);
		
	}).catch((e)=>{
		res.status(404).send(e)
	})
}

exports.UpdatePersonalRecords = (req, res, next)=>{
	const _userId = req.user._id;

	PersonalRecord = new PersonalRecords({
		status:  req.body.status,
		address: req.body.address,
		kinName: req.body.kinName,
		kinNumber:  req.body.kinNumber,
	})

	PersonalRecords.findOneAndUpdate({_userId:_userId}, {$set: {address:PersonalRecord.address, status:PersonalRecord.status, kinName:PersonalRecord.kinName,kinNumber:PersonalRecord.kinNumber}}, {new: true}).then((personalRecord)=> {
		if (!personalRecord) {
			const err ={status:403, message:"Unable to update"};
			return res.status(403).send(err);	
		}
		req.data ={status:201,loggerUser:"User", logsDescription:"Personal information update  Successful",title:"Personal information update", _id:_userId}
		next();
	}).catch((e)=>{
		console.log(e)
		return res.status(403).send(e);
	})
}


