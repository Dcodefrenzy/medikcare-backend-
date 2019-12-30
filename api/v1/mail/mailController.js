const nodemailer = require("nodemailer");
var sgTransport = require('nodemailer-sendgrid-transport');

const options = {
	 auth: {
		api_user: "Frenzykul",
		api_key: "Frenzykul01",
	},
}

const mailer = nodemailer.createTransport(sgTransport(options));

exports.mailUser = (req, res)=>{
	const recipient = res.user.email;
	const mailOption = {
		from:'medikcare1@gmail.com',
		to: recipient,
  		subject: 'Testing medikCare Email Platform',
  		text: "Testing MedikCare",
  		html: 'Dear'+req.user.firstname+req.user.lastname+', we are trying to send a mail via sendGrid using node mailer.</p><p>Welcome to medikCare mail we are testing presently but through this medium you will be able to receive mails concerning your coporative account such as</p><ol><li>Savings</li> <li>Emergency Loan</li><li>Shop Loan</li></ol>',
	};
	mailer.sendMail(mailOption, (error, info)=>{
		if (error) {
			console.log(error);
		}else{
			console.log('Message sent');
		}
	
	});

}


