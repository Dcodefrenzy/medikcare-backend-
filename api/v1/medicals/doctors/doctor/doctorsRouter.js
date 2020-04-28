const express = require('express');
const router = express.Router();
const doctorsController = require("./doctorsController");
const doctorsRecordsController = require("../doctorsRecords/doctorsRecordsController");
const userController = require("../../../users/usersController");
const logsController = require("../../../logs/logsController");
const metricsController = require("../../../metrics/ads/adsMetricsController");
const adminAuth = require("../../../admin/adminController");
const mailerController = require("../../../mail/mailController");
const chatmetricsController = require("../../../metrics/chat/chatMetricController");
const userReportController = require("./../../../records/reports/reportsRecordsController");
const chatSessionController = require("../../../health/healthConsultations/chat/chatController")



router.route("/register")
    .post(doctorsController.doctorRegister, doctorsRecordsController.addDoctorsRecords, mailerController.sendRegistrationMail, mailerController.adminNotification, logsController.addLogs);

router.route("/login")
    .post(doctorsController.doctorLogin);

router.route("/doctor")
    .get(doctorsController.doctorAuthenticate, );

router.route("/doctor-verify")
        .patch(doctorsController.doctorAuthenticate, doctorsController.mailVerification)
    
router.route("/admin/verify/:id")
        .patch(adminAuth.masterAdminAuthenticate, doctorsController.adminVerification)
        
router.route("/user/doctors")
    .get(userController.userAuthenticate, doctorsController.Userdoctors)
    
router.route("/admin/doctors")
    .get(adminAuth.adminAuthenticate, doctorsController.doctors)

router.route("/profile")
	.get(doctorsController.doctorAuthenticate,  doctorsRecordsController.getDoctorRecord)

router.route("/image/update")
	.post(doctorsController.doctorAuthenticate, doctorsController.updateImage)

router.route("/profile/update")
	.patch(doctorsController.doctorAuthenticate, doctorsController.updateDoctor, logsController.addLogs)
   
router.route("/chat/session/:id")
        .patch(doctorsController.doctorAuthenticate, userController.fetchUserById, chatSessionController.updateStartSession, mailerController.sendChatMail, logsController.addLogNext, userController.sendChatNotification, logsController.addLogs)

router.route("/password/change")
        .patch(doctorsController.doctorAuthenticate, doctorsController.passwordChange, logsController.addLogs)
    
router.route("/forget/password")
    .post(doctorsController.findAdminByMail, mailerController.sendPasswordMail)

router.route("/update/password")
    .post(doctorsController.doctorAuthenticate, doctorsController.newPasswordChange, logsController.addLogs)

router.route("/logout")
     .patch(doctorsController.doctorAuthenticate, doctorsController.logout, logsController.addLogs)
     	
router.route("/update/notification/:playerId")
    .patch(doctorsController.doctorAuthenticate, doctorsController.updatePersonNotification)
		
router.route("/report/add")
    .post(doctorsController.doctorAuthenticate, chatSessionController.updateEndSession, userReportController.addCompleteReportRecord, logsController.addLogNext, userController.findUserByID,mailerController.sendChatMail, logsController.notifyLogUser)

router.route("/notify-doctor")
    .post(userController.userAuthenticate, doctorsController.notifyDoctor)
    
router.route("/find-user/:id")
    .get(doctorsController.doctorAuthenticate, userController.findDoctorUserByID)
    
router.route("/admin/delete/:id")
    .patch(adminAuth.adminAuthenticate, doctorsController.deleteDoctor, logsController.addLogs)



    module.exports = router;