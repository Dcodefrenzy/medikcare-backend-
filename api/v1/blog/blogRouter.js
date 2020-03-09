const express = require("express");
const controller = require("./blogController");
const logsController = require("../logs/logsController")
const userController = require("../users/usersController");
const adminController = require("../admin/adminController");
const mailController = require("../mail/mailController");
const router = express.Router();



router.route("/add")
    .post(adminController.adminAuthenticate, controller.saveBlog, logsController.addLogs)

router.route("/")
    .get(adminController.adminAuthenticate, controller.getAllBlogs)

router.route("/:id")
    .get(adminController.adminAuthenticate, controller.getBlog)

router.route("/update/:id")
    .patch(adminController.adminAuthenticate, controller.updateBlog, logsController.addLogs)

router.route("/update-image/:id")
    .patch(adminController.adminAuthenticate, controller.updateImage, logsController.addLogs)

router.route("/publish/:id")
    .patch(adminController.adminAuthenticate, controller.deleteBlog, logsController.addLogs)

router.route("/notify-users/:id")
    .post(adminController.adminAuthenticate, controller.getBlogForUsers, userController.getUserMailsAndPlayerIDs, mailController.mailArrayOfUsers)

    module.exports = router;
