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
		//console.log(data)
		res.status(201).send(req.data);
	}).catch((e)=>{
		//sconsole.log(e)
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

exports.adminLogs =(req, res)=>{
	Logs.find({_loggerId:req.admin._id}).then((adminLogs)=>{
			if (!adminLogs) {
				
			const error = {status:404, message:"No Admin Log found."}
			return res.status(404).send(error)
			}
			const admin = {status:200, message:adminLogs}
			res.status(200).send(admin);
	}).catch((e)=>{
		
		const error = {status:404, message:"No Admin Log found."}
		return res.status(404).send(error)
	})
}

exports.getUserLogs = (req, res)=>{
	const _loggerId = req.user.id;
	Logs.find({_loggerId:_loggerId}).then((logs)=>{
		if (!logs) {
			return res.status(404).send("No logs for this user found");
		}
		log = {status:200, message:logs};
		res.status(200).send(log)
	}).catch((e)=>{
		res.status(404).send("No logs")
	});
}
exports.getUserUnreadLogs = (req, res)=>{
	const _loggerId = req.user.id;
	Logs.find({_loggerId:_loggerId, status:"Unread"}).then((logs)=>{
		if (!logs) {
			return res.status(404).send("No logs for this user found");
		}
		log = {status:200, message:logs};
		res.status(200).send(log)
	}).catch((e)=>{
		res.status(404).send("No logs")
	});
}

exports.updateLogs  = (req, res) =>{
	let _loggerId = "";
	if (req.admin) {
		 _loggerId = req.admin._id;
	}else if(req.user){
		_loggerId = req.user._id;
	}else if (req.doctor) {
		_loggerId = req.doctor._id;
	}
	Logs.updateMany({_loggerId:_loggerId}, {$set: {status:"read"}}, {new: true}).then((logs)=>{
		if (!logs) {		
		log = {status:404, message:"Error somewhere."};
		res.status(404).send(log)
		}
		log = {status:200, message:"logs updated"};
		res.status(200).send(log);
	}).catch((e)=>{
		console.log(e);
		log = {status:404, message:"Error somewhere."};
		res.status(404).send(log)
	});
}

