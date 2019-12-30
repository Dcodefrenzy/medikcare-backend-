const express = require('express');
const router = express.Router();
const doctorsRecordsController = require("./doctorsRecordsController");
const doctorsController = require("../doctor/doctorsController");
const userController = require("../../../users/usersController");
const logsController = require("../../../logs/logsController");
const metricsController = require("../../../metrics/ads/adsMetricsController");
const adminAuth = require("../../../admin/adminController");



router.route("/")
.get(userController.userAuthenticate, doctorsRecordsController.doctorRecords)

router.route("/admin/doctor/:id")
    .get(adminAuth.adminAuthenticate, doctorsRecordsController.getDoctorsRecord)

router.route("/update")
    .patch(doctorsController.doctorAuthenticate, doctorsRecordsController.UpdatePersonalRecords, logsController.addLogs)

router.route("/file/update")
    .post(doctorsController.doctorAuthenticate, doctorsRecordsController.updateAnnualPracticingLicence)
    
router.route("/user/doctor/:id")
    .get(userController.userAuthenticate, doctorsRecordsController.doctorUserRecord)





module.exports = router;