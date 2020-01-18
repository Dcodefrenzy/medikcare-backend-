const express = require('express');
const router = express.Router();
const answerController = require("./answersController");
const doctorController = require("../../../medicals/doctors/doctor/doctorsController");
const userController = require("../../../users/usersController");
const logsController = require("../../../logs/logsController");


router.route("/:id")
    .post(doctorController.doctorAuthenticate, answerController.addAnswer, logsController.addLogs)

router.route("/thankyou/:id")
    .patch(userController.userAuthenticate, answerController.usersThankYou, logsController.addLogs)

    router.route("/agrees/:id")
    .patch(doctorController.doctorAuthenticate, answerController.doctorAgrees, logsController.addLogs)


module.exports = router;