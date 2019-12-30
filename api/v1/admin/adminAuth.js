const express = require('express');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {mongoose} = require("../db/mongoose.js");
var {admin} = require("./adminModel.js");


exports.adminAuthenticate =  (req, res, next)=>{
		//requesting our token from header.
		var token = req.header('x-auth');
		admin.findByToken(token).then((body)=>{
			if (!body) {
				return promise.reject();
			}
			req.body = body;
			req.token = token;
			next();
	}).catch((e)=>{
		res.status(404).send("unauthorised person");
	});
}

exports.adminMasterAuthenticate =  (req, res, next)=>{
		//requesting our token from header.
		var token = req.header('x-auth');
		admin.findByToken(token).then((body)=>{
			if (!body) {
				return promise.reject();
			}
			if (body.level !== 2) {
				return promise.reject();
			}
			req.body = body;
			req.token = token;
			next();
	}).catch((e)=>{
		res.status(404).send("unauthorised person");
	});
}