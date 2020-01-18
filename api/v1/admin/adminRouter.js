const express = require("express");
const controller = require("./adminController.js");
const mailController = require("../mail/mailController")
const logController = require("../logs/logsController");
const router = express.Router();


router.route("/register")
	.post( controller.masterAdminAuthenticate,  controller.addAdmin, mailController.sendRegistrationMail, logController.addLogs)

router.route("/login")
	.post(controller.adminLogin)

router.route("/logout")
	.patch(controller.adminAuthenticate, controller.logout, logController.addLogs)

router.route("/update")
	.patch(controller.adminAuthenticate, controller.updateProfile)

router.route("/profile")
	.get(controller.adminAuthenticate, controller.adminProfile)

router.route("/profile/update")
.patch(controller.adminAuthenticate, controller.updateProfile, logController.addLogs)

router.route("/image/update")
.post(controller.adminAuthenticate, controller.updateImage)

router.route("/admin-verify")
	.patch(controller.adminAuthenticate, controller.mailVerification)

router.route("/")
	.get( controller.masterAdminAuthenticate,  controller.viewAdmins)

router.route("/:id")
	.patch(controller.masterAdminAuthenticate, controller.updateAdmin)

router.route("/suspend/:id")
	.patch(controller.masterAdminAuthenticate, controller.suspendAdmin)

router.route("/password/change")
	.patch(controller.adminAuthenticate, controller.passwordChange, logController.addLogs)


router.route("/forget/password")
	.post(controller.findAdminByMail, mailController.sendPasswordMail)


router.route("/update/password")
    .post(controller.adminAuthenticate, controller.newPasswordChange, logController.addLogs)
/*
router.route("/admin")
	.get(controller.masterAdminAuthenticate, controller.getAdmin)*/

/*router.route("/forgetpassword")
	 .post(controller.retrivePassword)*/
	 
/*router.route("/forgetpassword/:token")
	.patch(controller.forgetpassword)*/


/*router.route("/delete/:id")
	.delete(controller.masterAdminAuthenticate, controller.deleteAdmin)*/

module.exports = router;