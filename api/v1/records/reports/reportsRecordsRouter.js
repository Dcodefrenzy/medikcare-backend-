const express = require('express');
const router = express.Router();
const controller = require("./reportsRecordsController");
const adminController = require("../../admin/adminController");
const doctorController = require("../../medicals/doctors/doctor/doctorsController");
const userController = require("../../users/usersController";)
const logsController = require("../../logs/logsController");

router.route("doctor/reports")
	.get(doctorController.doctorAuthenticate.userAuthenticate,controllergetDoctorsReports, userController.viewUsersByIds)


	module.exports = router;