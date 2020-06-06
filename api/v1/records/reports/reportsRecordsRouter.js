const express = require('express');
const router = express.Router();
const controller = require("./reportsRecordsController");
const adminController = require("../../admin/adminController");
const doctorController = require("../../medicals/doctors/doctor/doctorsController");
const userController = require("../../users/usersController")
const logsController = require("../../logs/logsController");
const appointMentController = require("../../health/healthAppointments/healthAppontmentController");


router.route("/update/test")
	.post(doctorController.doctorAuthenticate, controller.updateTest)
	
router.route("/update/drugs")
	.post(doctorController.doctorAuthenticate, controller.updateMedications)


router.route("/update/report")
	.post(doctorController.doctorAuthenticate, controller.updateReport, appointMentController.addAppointment)

	
router.route("/delete/drugs/:id/:medication")
.patch(doctorController.doctorAuthenticate, controller.deleteMedication)


router.route("/delete/test/:id/:test")
.patch(doctorController.doctorAuthenticate, controller.deleteTest)


	module.exports = router;