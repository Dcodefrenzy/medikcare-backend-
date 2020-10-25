const express = require("express");

const api = express.Router();
const adminRouter = require("./admin/adminRouter.js");
const usersRouter = require("./users/usersRouter.js");
const personalRecordsRouter = require("./records/personal/personalRecordsRouter");
const doctorsRouter = require("./medicals/doctors/doctor/doctorsRouter");
const doctorRecordsRouter = require("./medicals/doctors/doctorsRecords/doctorsRecordsRouter");
const healthQuestionsRouter = require("./health/healthQuestions/questions/healthQuestionsRouter");
const healthAnswersRouter = require("./health/healthQuestions/answers/answersRouter");
const logsRouter = require("./logs/logsRouter.js");
const blogRouter = require("./blog/blogRouter");
const imagesRouter = require("./images/imagesRouter");
const maillerRouter = require("./mailer/mailerRouter");
const chatRouter = require("./health/healthConsultations/chat/chatRoute")
const userReportRouter = require("./records/reports/reportsRecordsRouter");
const appointmentRouter = require("./health/healthAppointments/healthAppontmentRouter");


api.use("/admins", adminRouter);
api.use("/user", usersRouter);
api.use("/user/personalrecords", personalRecordsRouter);
api.use("/doctor", doctorsRouter);
api.use("/doctors/records", doctorRecordsRouter);
api.use("/question", healthQuestionsRouter);
api.use("/question", healthQuestionsRouter);
api.use("/answer", healthAnswersRouter);
api.use("/logs", logsRouter);
api.use("/blogs", blogRouter);
api.use("/images", imagesRouter);
api.use("/mailler", maillerRouter);
api.use("/chatSession", chatRouter);
api.use("/userReport", userReportRouter);
api.use("/appointment", appointmentRouter);


module.exports = api;