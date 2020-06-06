const {appointments} = require("./healthAppontmentModel");




exports.addAppointment = (req, res, next)=>{
    const sessionId = req.data._sessionId;
    appointments.findOne({sessionId:sessionId}).then((session)=>{
        console.log({"session":sessionId})
        if (!session) {
            const appointment = new appointments({
                appointmentDate:req.body.appointmentDate,
                user:req.body._userId,
                doctor:req.body._doctorId,
                sessionId:req.data._sessionId
            });
        
            appointment.save().then((appointment)=>{
                console.log({"newAppoint":appointment})
                req.data.appointment = appointment
                req.data.status = 200;
            res.status(200).send(req.data);
            });
        }else{
            appointments.findOneAndUpdate({sessionId:sessionId}, {$set: { appointmentDate:req.body.appointmentDate}}).then((appointment)=>{
                console.log({"oldAppoint":appointment})
                req.data.appointment = appointment
                req.data.status = 200;
                 res.status(200).send(req.data);

            })
        }
    }).catch((e)=>{
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});

}