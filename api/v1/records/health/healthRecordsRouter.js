const express = require('express');
const router = express.Router();
const authUser = require(".../users/usersController.js");
const HealthRecordsController = require("./healthRecordsController.js");

/*router.route("/user/:id")
	.get(authUser.userAuthenticate, HealthRecordsController.getHealthRecords);
	.patch(authUser.userAuthenticate, HealthRecordsController.updateHealthRecords);
