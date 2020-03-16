const express = require("express");
const controller = require("./mailerController");
const logsController = require("../logs/logsController")
const userController = require("../users/usersController");
const adminController = require("../admin/adminController");
const mailController = require("../mail/mailController");
const router = express.Router();



router.route("/add")
    .post(adminController.adminAuthenticate, controller.saveMailler, logsController.addLogs)

router.route("/")
    .get(adminController.adminAuthenticate, controller.getAllMaillers, adminController.viewAdminsByIds)


router.route("/:id")
    .get(adminController.adminAuthenticate, controller.getMailler, adminController.viewAdminNameById)

router.route("/update/:id")
   .post(adminController.adminAuthenticate, controller.updateMailler, logsController.addLogs)


router.route("/delete/:id")
    .patch(adminController.adminAuthenticate, controller.deleteMailler, logsController.addLogs)

//router.route("/notify-users/:id")
   // .post(adminController.adminAuthenticate, controller.getBlogForUsers, userController.getUserMailsAndPlayerIDs, mailController.mailArrayOfUsers)

    module.exports = router;
