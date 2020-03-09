const express = require('express');
const router = express.Router();
const answerController = require("./answersController");
const doctorController = require("../../../medicals/doctors/doctor/doctorsController");
const userController = require("../../../users/usersController");
const logsController = require("../../../logs/logsController");
const mailController = require("../../../mail/mailController");


router.route("/:ansId/:id")
    .post(doctorController.doctorAuthenticate, answerController.addAnswer, logsController.addLogNext, userController.findAdminUserByID,mailController.userNotification)

router.route("/thankyou/:id")
    .patch(userController.userAuthenticate, answerController.usersThankYou, logsController.addLogs)

router.route("/agrees/:id")
    .patch(doctorController.doctorAuthenticate, answerController.doctorAgrees, logsController.addLogs)


router.route("/delete/:id")
    .patch(doctorController.doctorAuthenticate, answerController.deleteAnswerById, logsController.addLogs)
   
router.route("/update/:id")
        .patch(doctorController.doctorAuthenticate, answerController.updateAnswerById, logsController.addLogs)

router.route("/fetch/:id")
            .get(doctorController.doctorAuthenticate, answerController.getAnswersById)


module.exports = router;