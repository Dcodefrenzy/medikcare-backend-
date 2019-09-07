const express = require("express");
var router = express.Router();
var controller = require("./logsController.js");
const adminAuth = require("../admin/adminController.js");
const userAuth = require("../users/usersController.js");


router.route("/")
	.get(adminAuth.adminAuthenticate, controller.getAllLogs)

router.route("/:id")
	.get(adminAuth.adminAuthenticate, userAuth.userAuthenticate,  controller.getUserLogs)

router.route("/:id/:loan")
	.get(adminAuth.adminAuthenticate, controller.getEachLoanLogsForUsers)



	module.exports = router;