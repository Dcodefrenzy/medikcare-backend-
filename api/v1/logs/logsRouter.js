const express = require("express");
var router = express.Router();
var controller = require("./logsController.js");
const adminAuth = require("../admin/adminController");
const userController = require("../users/usersController");
const doctorController = require("../medicals/doctors/doctor/doctorsController");



router.route("/")
	.get(adminAuth.adminAuthenticate, controller.getAllLogs)


router.route("/admin")
	.get(adminAuth.adminAuthenticate,   controller.adminLogs)


router.route("/user")
	.get(userController.userAuthenticate,   controller.getUserLogs)

	router.route("/unread/user")
	.get(userController.userAuthenticate,   controller.getUserUnreadLogs)

	
router.route("/update/user")
	.get(userController.userAuthenticate,   controller.updateLogs)

	
router.route("/update/admin")
	.get(adminAuth.adminAuthenticate,   controller.updateLogs)
		
router.route("/update/doctor")
	.get(doctorController.doctorAuthenticate,   controller.updateLogs)








	module.exports = router;