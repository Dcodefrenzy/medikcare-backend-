const {appointments} = require("./healthAppontmentModel");
const CronJob = require('cron').CronJob;
const {getUsersForAppointment, notifyUserAppointment} = require("../../users/usersController");
const {getDoctorsForAppointment} = require("../../medicals/doctors/doctor/doctorsController");
const {appointmentUsersMail, appointmentDoctorMail} = require("../../mail/mailController");
const {appointmentSession} = require("../healthConsultations/chat/chatController");

var appointmentJob = new CronJob('0 9 * * *', function() {
    console.log('You will see this message every second');
    sendAppointment();
  }, null, true);
  appointmentJob.start(); 

  const sendAppointment  = async ()=>{
      const tomorrow =  new Date()
      tomorrow.setDate(tomorrow.getDate() + 2);
      const yesterday =  new Date()
      yesterday.setDate(yesterday.getDate() - 2);
  
      
     const appoint =  await appointments.find({$and: [{appointmentDate: {"$gte": yesterday}}, {appointmentDate: {"$lt": tomorrow}}]})
     //console.log(appoint)
     
          const user = await getUsersForAppointment(appoint)
         
          const appointment = await getDoctorsForAppointment(user);
          const result = await appointmentUsersMail(appointment)
          const doctorsResult = await appointmentDoctorMail(appointment)
          //console.log(result);
  }



  var job = new CronJob('0 9 * * *', function() {
    console.log('You should see this message every second');
    notifyAppoinment()
  }, null, true);
  job.start();

  const notifyAppoinment = async ()=> {
    const tomorrow =  new Date()
    tomorrow.setHours(tomorrow.getHours() + 13);
    console.log(tomorrow)
    const today =  new Date();
    const appoint =  await appointments.find({$and: [{appointmentDate: {"$gte": today}}, {appointmentDate: {"$lt": tomorrow}}]});
         
    const user = await getUsersForAppointment(appoint)
         
    const appointment = await getDoctorsForAppointment(user);

    
    const result = await appointmentUsersMail(appointment)
    const doctorsResult = await appointmentDoctorMail(appointment)
    const userNotify = await notifyUserAppointment(appointment)

    //create session
    
  }


  exports.addAppointment = (req, res, next)=>{
    const sessionId = req.data._sessionId;
    appointments.findOne({sessionId:sessionId}).then((session)=>{
        console.log({"session":sessionId})
        if (!session && req.body.appointmentDate !== null) {
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
        }else if(!session && req.body.appointmentDate === null){
            res.status(200).send(req.data);
        }else if(session && req.body.appointmentDate === null){
            appointments.findOneAndDelete({sessionId:session}).then(()=>{
            res.status(200).send(req.data);
            })
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

exports.fetchAppointment = (req, res, next)=>{
    console.log(req.params)
       const _id =  req.params.appointmentId;
       appointments.findById({_id:_id}).then((appointment)=>{
           if (appointment && appointment.start === true) {
            err = {status:403, message:"appointment started already", appointment:appointment}
            res.status(403).send(err);
           }else{
            req.data = {appointment:appointment};
         
            next();
           }
   
       }).catch((e)=>{
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});

}

exports.sendAppointmentMessage = (req, res, next)=>{
    let name, id;
    if (req.user) {
      name = req.user.firstname+" "+req.user.lastname; 
      id = req.user._id; 
    }else if(req.doctor){
        name = req.doctor.firstname+" "+req.doctor.lastname;
        id = req.doctor._id;
    }
    req.data.topic = "Session Notificaion."
    req.data.logsDescription = `${name} have started a follow up session with you, please click the link below to join`;
    req.data.link = "https:://medikcare.com/chat/"+id;

    next();
}

exports.startAppointment = (req, res, next)=>{
    _id = req.data.appointment._id;
    appointments.findByIdAndUpdate({_id:_id}, {$set: {start:true}}, {new: true}).then((appoint)=>{
        next();
    })
}