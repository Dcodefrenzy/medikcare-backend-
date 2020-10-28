const express = require("express");
const controller = require("./imagesController");
const userController = require("../users/usersController");
const adminController = require("../admin/adminController");
const doctorController = require("../medicals/doctors/doctor/doctorsController");
const router = express.Router();


router.route("/post")
    .post(adminController.adminAuthenticate, controller.updateImage)
    

router.route("/user/chat")
    .post(userController.userAuthenticate, controller.updateChatImage)


router.route("/doctor/chat")
    .post(doctorController.doctorAuthenticate, controller.updateChatImage)

router.route("/")
	.get(adminController.adminAuthenticate, controller.fetchAllImages)

    module.exports = router;