const express = require('express');
const router = express.Router();
const auth = require(".../admin/adminController.js");
const adsMetricsController = require("./adsMetricsController.js");

/*router.route("/users")
	.get(auth.masterAdminAuthenticate, adsMetricsController.getAdMetricsForUsers);

router.route("/doctors")
	.get(auth.masterAdminAuthenticate, adsMetricsController.getAdMetricsForDoctors);

router.route("/doctors")
	.get(auth.masterAdminAuthenticate, adsMetricsController.getAdMetricsForLabs);

router.route("/doctors")
	.get(auth.masterAdminAuthenticate, adsMetricsController.getAdMetricsForHospitals);*/