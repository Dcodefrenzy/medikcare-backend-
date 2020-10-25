const express = require("express");
const controller = require("./healthAppontmentController");
const chatController = require("../healthConsultations/chat/chatController");
const logsController = require("../../logs/logsController");
const userController = require("../../users/usersController");
const doctorController = require("../../medicals/doctors/doctor/doctorsController");
const mailController = require("../../mail/mailController");
const router = express.Router();




router.route("/doctor/read/:appointmentId/:sessionId")
    .get(doctorController.doctorAuthenticate, controller.fetchAppointment, userController.findUserByID, chatController.updateAppointmentSession, logsController.addLogNext, logsController.addLogs)   

router.route("/user/read/:appointmentId/:sessionId")
    .get(userController.userAuthenticate, controller.fetchAppointment, doctorController.findDoctorByID,  chatController.updateAppointmentSession, logsController.addLogNext, logsController.addLogs)

router.route("/user/start/:appointmentId")
    .patch(userController.userAuthenticate, controller.fetchAppointment, controller.startAppointment, doctorController.findDoctorByID, controller.sendAppointmentMessage, mailController.sendChatMail, doctorController.notifyDoctorAppointment)
    
router.route("/doctor/start/:appointmentId")
    .patch(doctorController.doctorAuthenticate, controller.fetchAppointment, controller.startAppointment, userController.findUserByID, controller.sendAppointmentMessage, mailController.sendChatMail, userController.notifyAppointment,)

    
    module.exports = router;