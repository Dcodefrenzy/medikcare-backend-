const express = require("express");
const controller = require("./usersController.js");
const auth = require("../admin/adminController.js");
const adsmetricsController = require("../metrics/ads/adsmetricsController.js");
const healthController = require("../records/health/healthRecordsController.js");
const personalController = require("../records/personal/personalRecordsController.js");
const logs = require("../logs/logsController.js");
const mailerController = require("../mail/mailController");
const router = express.Router();



router.route("/users")
	.get(auth.adminAuthenticate, controller.viewusers)

router.route("/register")
	.post(controller.adduser,personalController.addPersonalRecords,healthController.addHealthRecords, adsmetricsController.addAdsMetricsUser,mailerController.sendRegistrationMail, logs.addLogs)

router.route("/users/:id")
	.get(auth.adminAuthenticate, controller.getuser)

router.route("/login")
	.post(controller.userLogin, logs.addLogs)

router.route("/user-verify")
		.patch(controller.userAuthenticate, controller.mailVerification)

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

/*router.route("/forgetpassword/:token")
	.patch(controller.forgetpassword)
*/
router.route("/forget/password")
    .post(controller.findAdminByMail, mailerController.sendPasswordMail)

router.route("/update/password")
    .post(controller.newPasswordChange, logs.addLogs)


module.exports = router;