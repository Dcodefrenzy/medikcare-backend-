const express = require("express");

const api = express.Router();
const adminRouter = require("./admin/adminRouter.js");
const usersRouter = require("./users/usersRouter.js");
const logsRouter = require("./logs/logsRouter.js");
/*const mailRouter = require("./mail/mailRouter.js");*/


api.use("/admins", adminRouter);
api.use("/user", usersRouter);
api.use("/logs", logsRouter);
/*api.use("/mails", mailRouter);*/


module.exports = api;