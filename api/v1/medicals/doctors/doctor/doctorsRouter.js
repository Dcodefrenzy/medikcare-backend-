const express = require('express');
const router = express.Router();
const doctorsController = require("./doctorsController");
const doctorsRecordsController = require("../doctorsRecords/doctorsRecordsController");
const userController = require("../../../users/usersController");
const logsController = require("../../../logs/logsController");
const metricsController = require("../../../metrics/ads/adsMetricsController");
const adminAuth = require("../../../admin/adminController");
const mailerController = require("../../../mail/mailController");



router.route("/register")
    .post(doctorsController.doctorRegister, doctorsRecordsController.addDoctorsRecords,metricsController.addAdsMetricsUser, mailerController.sendRegistrationMail, logsController.addLogs);

router.route("/login")
    .post(doctorsController.doctorLogin);

router.route("/doctor")
    .get(doctorsController.doctorAuthenticate, );

router.route("/doctor-verify")
        .patch(doctorsController.doctorAuthenticate, doctorsController.mailVerification)
    
router.route("/admin/verify/:id")
        .patch(adminAuth.masterAdminAuthenticate, doctorsController.adminVerification)
        
router.route("/user/doctors")
    .get(userController.userAuthenticate, doctorsController.doctors)
    
router.route("/admin/doctors")
    .get(adminAuth.adminAuthenticate, doctorsController.doctors)

router.route("/profile")
	.get(doctorsController.doctorAuthenticate,  doctorsRecordsController.getDoctorRecord)

router.route("/image/update")
	.post(doctorsController.doctorAuthenticate, doctorsController.updateImage)

router.route("/profile/update")
	.patch(doctorsController.doctorAuthenticate, doctorsController.updateDoctor, logsController.addLogs)
   
router.route("/chat/session/:id")
        .get(userController.userAuthenticate, doctorsController.findDoctor,mailerController.sendChatMail, logsController.addLogs)

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
		
router.route("/notify-doctor")
	.post(userController.userAuthenticate, doctorsController.notifyDoctor)


    module.exports = router;