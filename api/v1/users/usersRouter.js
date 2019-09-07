const express = require("express");
const controller = require("./usersController.js");
const auth = require("../admin/adminController.js");
const mailConroller = require("../mail/mailController.js");
const adsmetricsController = require("../metrics/ads/adsmetricsController.js");
const healthController = require("../records/health/healthRecordsController.js");
const personalController = require("../records/personal/personalRecordsController.js");
const logs = require("../logs/logsController.js");
const router = express.Router();



router.route("/users")
	.get(auth.adminAuthenticate, controller.viewusers)

router.route("/register")
	.post(controller.adduser,personalController.addPersonalRecords,healthController.addHealthRecords, adsmetricsController.addAdsMetricsUser, logs.addLogs)

router.route("/users/:id")
	.get(auth.adminAuthenticate, controller.getuser)

router.route("/login")
	.post(controller.userLogin)

router.route("/:id")
	.get(controller.getuser)
	.patch(controller.userAuthenticate, controller.updateuser)
	.delete(auth.masterAdminAuthenticate, controller.deleteuser)


/*router.route("/forgetpassword")
	 .post(controller.retrivePassword)*/

/*router.route("/forgetpassword/:token")
	.patch(controller.forgetpassword)
*/


module.exports = router;