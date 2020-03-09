const express = require("express");
const router = express.Router();
const healthQuestionsController = require("./healthQuestionsController");
const logController = require("../../../logs/logsController");
const userController = require("../../../users/usersController");
const doctorController = require("../../../medicals/doctors/doctor/doctorsController");
const adminController = require("../../../admin/adminController");
const answersController = require("../answers/answersController");
const mailController = require("../../../mail/mailController")


router.route("/ask")
    .post(userController.userAuthenticate, healthQuestionsController.addQuestion, logController.addLogNext,doctorController.getAllDoctorsForMail, mailController.sendDoctorsQuestionMail, doctorController.notifyDoctors)

    router.route("/user/questions")
        .get(userController.userAuthenticate, healthQuestionsController.getAllQuestion, answersController.GetAnswers)
    router.route("/doctor/questions")
        .get(doctorController.doctorAuthenticate, healthQuestionsController.getAllQuestion, answersController.GetAnswers)
    router.route("/admin/questions")
        .get(adminController.adminAuthenticate, healthQuestionsController.getAllQuestion, answersController.GetAnswers)

    router.route("/user/question/answers/:id")
        .get(userController.userAuthenticate, healthQuestionsController.getQuestion, answersController.GetQuestionAnswers)

    router.route("/doctor/question/answers/:id")
        .get(doctorController.doctorAuthenticate, healthQuestionsController.getQuestion, answersController.GetQuestionAnswers)




module.exports=  router;