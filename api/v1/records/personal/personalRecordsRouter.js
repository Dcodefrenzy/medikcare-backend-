const express = require('express');
const router = express.Router();
const authUser = require("../../users/usersController");
const personalRecordsController = require("./personalRecordsController.js");
const logsController = require("../../logs/logsController");

router.route("/update")
	.patch(authUser.userAuthenticate, personalRecordsController.UpdatePersonalRecords, logsController.addLogs)


	module.exports = router;