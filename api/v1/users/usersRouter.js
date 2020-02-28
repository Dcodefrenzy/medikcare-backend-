const express = require("express");
const controller = require("./usersController.js");
const auth = require("../admin/adminController.js");
const adsmetricsController = require("../metrics/ads/adsMetricsController.js");
const healthController = require("../records/health/healthRecordsController.js");
const personalController = require("../records/personal/personalRecordsController.js");
const logs = require("../logs/logsController.js");
const mailerController = require("../mail/mailController");
const doctorController = require("../medicals/doctors/doctor/doctorsController");
const doctortmetricsController = require("../metrics/doctorsMetric/doctorsMetricController");
const chatmetricsController = require("../metrics/chat/chatMetricController");

const reportController = require("../records/reports/reportsRecordsController");
const router = express.Router();


router.route("/users")
	.get(auth.adminAuthenticate, controller.viewusers)

router.route("/register")
	.post(controller.adduser,personalController.addPersonalRecords,healthController.addHealthRecords, adsmetricsController.addAdsMetricsUser,mailerController.sendRegistrationMail,mailerController.adminNotification, logs.addLogs)

router.route("/users/:id")
	.get(auth.adminAuthenticate, controller.getuser)

router.route("/login")
	.post(controller.userLogin, logs.addLogs)
		
router.route("/notify-user")
	.post(doctorController.doctorAuthenticate, controller.notifyUser)

router.route("/user-verify")
		.patch(controller.userAuthenticate,controller.chekMailVerification, mailerController.sendWelcomeMail,mailerController.onboardingCustomers, controller.mailVerification)

router.route("/admin/:id")
	.get(auth.adminAuthenticate, controller.findUser, personalController.getPersonalRecords)
	
router.route("/:id")
	//.get(controller.getuser)
	//.patch(controller.userAuthenticate, controller.updateuser)
	//.delete(auth.masterAdminAuthenticate, controller.deleteuser)

router.route("/profile")
	.get(controller.userAuthenticate,  personalController.getPersonalRecords)

router.route("/image/update")
	.post(controller.userAuthenticate, controller.updateImage)

router.route("/profile/update")
	.patch(controller.userAuthenticate, controller.updateUser, logs.addLogs)

router.route("/logout")
	 .patch(controller.userAuthenticate, controller.logout, logs.addLogs)


 router.route("/password/change")
	 .patch(controller.userAuthenticate, controller.passwordChange, logs.addLogs)

router.route("/forget/password")
    .post(controller.findUserByMail, mailerController.sendPasswordMail)

router.route("/update/password")
	.post(controller.userAuthenticate, controller.newPasswordChange, logs.addLogs)
	
router.route("/notification")
    .get(controller.userAuthenticate, controller.sendPersonNotification)	
	
router.route("/update/notification/:playerId")
		.patch(controller.userAuthenticate, controller.updatePersonNotification)
		
router.route("/reports")
	.get(controller.userAuthenticate, reportController.getUserReports)

router.route("/chatMetric/add")
		.post(controller.userAuthenticate, chatmetricsController.addChatMetricsUser, doctortmetricsController.addDoctorMetricsUser, logs.addLogNext, reportController.addIncompleteReportRecord, doctorController.findDoctorByID,mailerController.sendChatMail, logs.notifyLogUser)	
		

		

module.exports = router;