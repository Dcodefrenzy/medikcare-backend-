const express = require("express");
const controller = require("./chatController");
const logsController = require("../../../logs/logsController");
const userController = require("../../../users/usersController");
const doctorController = require("../../../medicals/doctors/doctor/doctorsController");
const adminController = require("../../../admin/adminController");
const mailController = require("../../../mail/mailController");
const router = express.Router();




router.route("/create")
    .post(userController.userAuthenticate, controller.createSession,doctorController.getAllDoctorsForMail, mailController.sendDoctorsChatSession, logsController.addLogs)


router.route("/")
    .get(doctorController.doctorAuthenticate, controller.getSessions, userController.viewUsersByIds)
 
router.route("/user/:id")
    .get(userController.userAuthenticate, controller.getUserSession)

router.route("/admin")
    .get(adminController.adminAuthenticate, controller.getSession)

router.route("/start/:id")
    .patch(doctorController.doctorAuthenticate, controller.updateStartSession)


 module.exports = router;

