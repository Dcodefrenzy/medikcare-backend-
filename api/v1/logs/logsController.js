var Logs = require("./logsModel.js");
var {ObjectID} = require("mongodb");


exports.addLogs = (req, res)=>{
	//details of the loan. 
	log = new Logs({
			title: req.data.title,
			description: req.data.logsDescription,
			loggerUser: req.data.loggerUser,
			_loggerId: req.data._id,
			date:  new Date,
	});
	
	log.save().then((data)=>{
		if (!data) {
			return res.status(404).send("Unable to add to logs");
		}
		res.status(200).send(req.data);
	}).catch((e)=>{
		res.status(404).send(e);
	});
}


exports.getAllLogs = (req, res)=>{
	Logs.find().then((logs)=>{
		if (!logs) {
			return res.status(404).send("No logs found");
		}
		res.status(200).send(logs);
	}).catch((e)=>{
		res.status(404).send("Unable to find log");
	});
}

exports.getUserLogs = (req, res)=>{
	var _userId = req.params.id;
	Logs.find({_userId}).then((logs)=>{
		if (!logs) {
			return res.status(404).send("No logs for this user found");
		}
		res.status(200).send(logs);
	}).catch((e)=>{
		res.status(404).send("No logs")
	});
}


exports.getEachLoanLogsForUsers = (req, res)=>{
	var _userId = req.params.id;
	var _loanId = req.params.loan;
/*	console.log(_userId, _loanId);*/
	Logs.find({_userId, _loanId}).then((logs)=>{
		if (!logs) {
			return res.status(404).send("No logs for this loan found"); 
		}
		res.status(200).send(logs);
	}).catch((e)=>{
		res.status(404).send("");
	});
}