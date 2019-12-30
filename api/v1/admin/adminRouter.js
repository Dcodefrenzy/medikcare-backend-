const express = require("express");
const controller = require("./adminController.js");
const auth = require("./adminAuth.js");
const router = express.Router();


router.route("/register")
	.post(controller.masterAdminAuthenticate, controller.addAdmin)

router.route("/login")
	.post(controller.adminLogin)

router.route("/update")
	.patch(controller.adminAuthenticate, controller.updateProfile)

router.route("/profile")
	.get(controller.adminAuthenticate, controller.adminProfile)

router.route("/")
	.get(controller.masterAdminAuthenticate, controller.viewAdmins)

router.route("/:id")
	.patch(controller.masterAdminAuthenticate, controller.updateAdmin)
	.delete(controller.masterAdminAuthenticate, controller.deleteAdmin)


/*
router.route("/admin")
	.get(controller.masterAdminAuthenticate, controller.getAdmin)*/

/*router.route("/forgetpassword")
	 .post(controller.retrivePassword)*/
	 
/*router.route("/forgetpassword/:token")
	.patch(controller.forgetpassword)*/



module.exports = router;