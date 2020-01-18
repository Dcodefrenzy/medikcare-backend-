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
/*const mailRouter = require("./mail/mailRouter.js");*/


api.use("/admins", adminRouter);
api.use("/user", usersRouter);
api.use("/user/personalrecords", personalRecordsRouter);
api.use("/doctor", doctorsRouter);
api.use("/doctors/records", doctorRecordsRouter);
api.use("/question", healthQuestionsRouter);
api.use("/question", healthQuestionsRouter);
api.use("/answer", healthAnswersRouter);
api.use("/logs", logsRouter);
/*api.use("/mails", mailRouter);*/


module.exports = api;