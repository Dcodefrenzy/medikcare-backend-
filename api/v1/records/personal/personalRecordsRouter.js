const express = require('express');
const router = express.Router();
const authUser = require(".../users/usersController.js");
const personalRecordsController = require("./personalRecordsController.js");

/*router.route("/user/:id")
	.get(authUser.userAuthenticate, personalRecordsController.getPersonalRecords);
	.patch(authUser.userAuthenticate, personalRecordsController.updatePersonalRecords);
