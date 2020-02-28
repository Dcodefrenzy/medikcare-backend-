let nodemailer = require('nodemailer');
let sgTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config()

let options = {
	auth: {
	  api_user: process.env.SENDGRID_API_USER,
	  api_key: process.env.SENDGRID_API_PASS,
	}
  }
  let client = nodemailer.createTransport(sgTransport(options));
  
exports.mailUsers = (req, res)=>{
	const usersName = req.data.name;
	const usermail = req.data.email;
	const token = req.data.token;
	let url;
	if(req.data.isUser) {
		url = "medikcare.com/user/verification/verify/"+token
	}else if(req.data.isDoctor) {
		url = "medikcare.com/doctor/verification/verify/"+token
	}
	else if(req.data.isAdmin) {
		url = "medikcare.com/admin/verification/verify/"+token
	}
	  
	  let email = {
		to: usermail,
		from: `"medikcare" support@medikcare.com`,
		subject: 'Medikcare User Registration',
		text: '',
		html: `<div style="border:3px solid #fff; padding-top:20px;"><img style="50%" src="https://www.medikcare.com/MedikImage/MED3.png" /><h1 style="text-align:center">Registration Successful</h1><p><b>Dear ${usersName} </b></p><p style="margin-bottom:50px">We are glad to inform you that your registration was successful please click on the button below to verify your account.</p> <a href=${url} style="background-color:green; border:0px; border-radius:10px; width:100%; padding:10px;  color:white;">Click Here</a><div>`,
	
		 };
	  
	  client.sendMail(email, function(err, info){
		  if (err ){
			console.log(err);
			res.status(403).send({status:403});
		  }
		  else {
			console.log('Message sent: ' + info);
			res.status(200).send({status:200});
		  }
	  });	
}
exports.sendRegistrationMail = (req, res, next) =>{
	const usersName = req.data.name;
	const usermail = req.data.email;
	const token = req.data.token;
	let url;
	if(req.data.isUser) {
		url = "medikcare.com/user/verification/verify/"+token
	}else if(req.data.isDoctor) {
		url = "medikcare.com/doctor/verification/verify/"+token
	}
	else if(req.data.isAdmin) {
		url = "medikcare.com/admin/verification/verify/"+token
	}
	  
	  let email = {
		to: usermail,
		from: `"medikcare" support@medikcare.com`,
		subject: 'Medikcare User Registration',
		text: '',
		html: `<div style="border:3px solid #fff; padding-top:20px;"><img style="50%" src="https://www.medikcare.com/MedikImage/MED3.png" /><h1 style="text-align:center">Registration Successful</h1><p><b>Dear ${usersName} </b></p><p style="margin-bottom:50px">We are glad to inform you that your registration was successful please click on the button below to verify your account.</p> <a href=${url} style="background-color:green; border:0px; border-radius:10px; width:100%; padding:10px;  color:white;">Click Here</a><div>`,
	
		 };
	  
	  client.sendMail(email, function(err, info){
		  if (err ){
			console.log(err);
		  }
		  else {
			console.log('Message sent: ' + info);
		  }
		  next()
	  });
		
}

exports.sendWelcomeMail = (req, res, next) =>{
	let usersName, usermail;
	if(req.isUser === true){
		usersName = req.user.firstname+" "+req.user.lastname;
		usermail = req.user.email;
	}else{
		usersName = req.doctor.firstname+" "+req.doctor.lastname;
		usermail = req.doctor.email;
	}
	  
	  let email = {
		to: usermail,
		from: `"Ayo From Medikcare" ayodeji@medikcare.com`,
		subject: `Hello ${usersName}`,
		text: 'and easy to do anywhere, even with Node.js',
		html: `<div style="border:3px solid #fff; padding-top:20px;"><img style="50%" src="https://www.medikcare.com/MedikImage/MED3.png" /><p><b>Hi ${usersName}, </b></p><p style="margin-bottom:25px;">My name is Ayodeji Fakune, Co-founder of medikcare, I want to say a big thank you for registering with us and we are glad to have you onboard.</p style="margin-bottom:25px;">Medikcare started with the goal of providing a better, faster and affordable health care system using digital technology. We are glad to have you join us as we begin a journey to achieve this goal together.</p><p style="margin-bottom:25px">To assist you in having a wonderful experience on our platform I present to you <a href="mailto: ope@medikcare.com">Ope</a>, She will be your guide concerning any step you want to take on medikcare. you can reach her at <a href="mailto: ope@medikcare.com">ope@medikcare.com</a>. You can also reach our support team for any technical issues  at <a href="mailto: support@medikcare.com">support@medikcare.com</a></p> <p style="margin-top:70px">Ayodeji Fakunle,</p><p style="">CEO,Medikcare.</p><div>`,
	 
		  };
	  
	  client.sendMail(email, function(err, info){
		  if (err ){
			console.log(err);
		  }
		  else {
			console.log('Message sent: ' + info);
		  }
		  next()
	  });
		
}

exports.onboardingCustomers = (req, res, next) =>{
	let usersName, usermail;
	if(req.isUser === true){
		usersName = req.user.firstname+" "+req.user.lastname;
		usermail = req.user.email;
	}else{
		usersName = req.doctor.firstname+" "+req.doctor.lastname;
		usermail = req.doctor.email;
	}

	  
	  let email = {
		to: usermail,
		from: `"Ope from Medikcare" ope@medikcare.com`,
		subject: `Hello ${usersName}`,
		text: 'and easy to do anywhere, even with Node.js',
		html: `<div style="border:3px solid #fff; padding-top:20px;"><img style="50%" src="https://www.medikcare.com/MedikImage/MED3.png" /><p><b>Hi ${usersName}, </b></p><p style="margin-bottom:25px">My name is Opeyemi. I am also a Co-founder at medikcare and I will be your guide. My job is to assist you by sharing tips on how to use medikcare and answer any questions you might have.</p><p style="margin-bottom:50px;">Please feel free to contact me at <a href="mailto: ope@medikcare.com">Ope@medikcare.com</a></p><p style="margin-top:70px">Warm regards,</p><p style="">Opeyemi Akintomide.</p><div>`,
	 
		  };
	  
	  client.sendMail(email, function(err, info){
		  if (err ){
			console.log(err);
		  }
		  else {
			console.log('Message sent: ' + info);
		  }
		  next()
	  });
		
}

exports.adminNotification = (req, res, next) =>{
	const usersName = req.data.name;

	if(req.data.isUser) {
		
	message = `A user ${usersName} just registered on medikcare, please attend.`
	}else if(req.data.isDoctor) {
		message = `A Doctor ${usersName} just registered on medikcare, please attend.`
	}
	else if(req.data.isAdmin) {
		message = `An Admin ${usersName} just registered on medikcare, please attend.`
	}

	  
	  let email = {
		to: "medikcare1@gmail.com, ope@medikcare.com",
		from: `"medikcare" support@medikcare.com`,
		subject: `Registration Notification`,
		text: 'and easy to do anywhere, even with Node.js',
		html: `<div style="border:3px solid #fff; padding-top:20px;"><img style="50%" src="https://www.medikcare.com/MedikImage/MED3.png" /><p><b>Hello official, </b></p><p style="margin-bottom:50px">${message}</p><a href="https://medikcare.com/admin/login">Login</a><div>`,
	 
		  };
	  
	  client.sendMail(email, function(err, info){
		  if (err ){
			console.log(err);
		  }
		  else {
			console.log('Message sent: ' + info);
		  }
		  next()
	  });
		
}

exports.sendChatMail = (req, res, next) =>{
		const usermail = req.data.email;
		const name = req.data.name;
		const url = req.data.link;
		const topic = req.data.topic; 
		const message = req.data.logsDescription;
		let email = {
			to: usermail,
			from: `"medikcare" support@medikcare.com`,
			subject: 'Medikcare Notification',
			text: '',
			html: `<div style="border:3px solid #fff; padding-top:20px;"><img style="50%" src="https://www.medikcare.com/MedikImage/MED3.png" /><h1 style="text-align:center">${topic}</h1><p><b>Dear ${name} </b></p><p style="margin-bottom:50px">${message}.</p> <a href=${url} style="margin-top:50px;background-color:green; border:0px; border-radius:10px; width:100%; padding:10px;  color:white;">Click Here</a><div>`,
		  };

		  client.sendMail(email, function(err, info){
			if (err ){
			  console.log(err);
			}
			else {
			  console.log('Message sent: ' + info);
			}
			next()
		});
}
exports.sendPasswordMail = (req, res, next) =>{
	const usermail = req.data.email;
	const name = req.data.name;
	const url = req.data.link;
	const topic = req.data.title; 
	const message = req.data.logsDescription;
	let email = {
		to: usermail,
		from: `"medikcare" support@medikcare.com`,
		subject: 'Medikcare Notification',
		text: '',
		html: `<div style="border:1px solid #fff; padding-top:20px;"><img style="50%" src="https://www.medikcare.com/MedikImage/MED3.png" /><h1 style="text-align:center">${topic}</h1><p><b>Dear ${name} </b></p><p style="margin-bottom:50px">${message}.</p> <a href=${url} style="background-color:green; border:0px; border-radius:10px; width:100%; padding:10px;  color:white;">Click Here</a><div>`,
	  };

	  client.sendMail(email, function(err, info){
		if (err ){
		  console.log(err);
		}
		else {
			response = {status:201,message:`Hi, ${name} we found your account and have sent a link to your mail for a password update.`}
			return res.status(201).send(response);
		  //console.log('Message sent: ' + info);
		}
		
	});
}







/*let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.MAIL_USER,
	  pass: process.env.MAIL_PASS
	}
  });

  let mailOptions = {
	from: process.env.MAIL_USER,
	to: usermail,
	subject: 'Medikcare User Registration',
	html: `<div style="border:1px solid #fff; padding-top:20px;"><h1 style="text-align:center">Registration Successful</h1><p><b>Dear ${usersName} </b></p><p>We are glad to inform you that your registration was successful please click on the button below to verify your account.</p> <a href=${url} style="background-color:green; border:0px; border-radius:10px; width:100%; padding:10px;  color:white;">Click Here</a><div>`
  };
  transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	  console.log("Error")
	}
		next();
	
  });*/	