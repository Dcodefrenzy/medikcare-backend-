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
		from: process.env.MAIL_USER,
		subject: 'Medikcare User Registration',
		text: 'and easy to do anywhere, even with Node.js',
		html: `<div style="border:1px solid #fff; padding-top:20px;"><h1 style="text-align:center">Hi ${usersName},</h1><p>Thank you for creating an account on MedikCare. Please click on the button below to activate your account.</p> <a href=${url} style="background-color:green; border:0px; border-radius:10px; width:100%; padding:10px;  color:white;">Click Here</a><div>`,
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
			from: process.env.MAIL_USER,
			subject: 'Medikcare Notification',
			text: '',
			html: `<div style="border:1px solid #fff; padding-top:20px;"><h1 style="text-align:center">${topic}</h1><p><b>Dear ${name} </b></p><p>${message}.</p> <a href=${url} style="background-color:green; border:0px; border-radius:10px; width:100%; padding:10px;  color:white;">Click Here</a><div>`,
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