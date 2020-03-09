const express = require("express");
const controller = require("./imagesController");
const userController = require("../users/usersController");
const adminController = require("../admin/adminController");
const router = express.Router();


router.route("/post")
    .post(adminController.adminAuthenticate, controller.updateImage)
    

router.route("/")
	.get(adminController.adminAuthenticate, controller.fetchAllImages)

    module.exports = router;