const express = require('express');
let {mongoose} = require("../db/mongoose.js");
const {ObjectID} = require('mongodb');
let {admins} = require("./adminModel.js");
const _ = require('lodash');


exports.adminAuthenticate =  (req, res, next)=> {
		//requesting our token from header.
		const token = req.header('x-auth');
		admins.findByToken(token).then((admin)=>{
			if (!admin) {
				return promise.reject();
			}
			req.admin = admin;
			req.token = token;

			next();
	}).catch((e)=>{
		res.status(404).send("unauthorised person");
	});
}

exports.masterAdminAuthenticate =  (req, res, next)=> {
		//requesting our token from header.
		const token = req.header('x-auth');
		admins.findByToken(token).then((admin)=>{
			if (!admin) {
				return promise.reject();
			}
			if (admin.level != 1) {
				return promise.reject();
			}
			req.admin = admin;
			req.token = token;

			next();
	}).catch((e)=>{
		res.status(404).send("unauthorised person");
	});
}


exports.addAdmin = (req, res)=> {
	const admin = new admins({
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		level: req.body.level,
		verification: 1,
		dateCreated: new Date,
		deleteAdmin: 0,
		password: req.body.phoneNumber,
		_createdBy: req.admin._id
	});

	admin.save().then((admin)=> {
		return admin.generateAuthToken();
	}).then((token)=>{
		res.status(200).send(admin);
	
	}).catch((e)=>{
		res.status(404).send(admin);
	});
}

exports.viewAdmins = (req, res)=> {
	admins.find().then((data)=>{
		res.status(200).json(data);
	}).catch((e)=>{
		res.status(404).send("No admins");
	})
}

exports.adminLogin = (req, res)=> {
		const admin = new admins({
		email : req.body.email,
		password : req.body.password
	});
	admins.findByCredentials(admin.email, admin.password).then((admin)=>{
		return admin.generateAuthToken().then((token)=>{
			res.header('x-auth', token).send(admin);
		});
	}).catch((e)=>{
		res.status(400).send("unable to login");
	});

}
exports.updateAdmin = (req, res)=> {
	const id = req.params.id;
	const level = req.body.level;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("Invalid Id");
	}
	admins.findByIdAndUpdate(id, {$set: {level:level,}}, {new: true}).then((data)=> {
		if (!data) {
			return res.status(404).send("unable to update");
		}
		res.status(200).send(data);
		
	}).catch((e)=>{
		res.status(404).send("unable to update");
	})
}

exports.updateProfile = (req, res)=> {
	const id = req.admin._id;
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;

	admins.findByIdAndUpdate(id, {$set: {firstname:firstname, lastname:lastname}}, {new: true}).then((data)=> {
		if (!data) {return res.status(404).send("Unable to update");}
		res.status(200).send(data);
	}).catch((e)=>{
		return res.status(404).send("Unable to update");
	})

}

exports.adminProfile = (req, res)=> {
	const id = req.admin._id;
	admins.findOne(id).then((data)=> {
	if (!data) {return res.status(403).send("No user with this id")}
		res.status(200).send(data);
	}).catch((e) => {
		return res.status(403).send("No user with this id");
	})
}

exports.deleteAdmin = (req, res)=> {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("error no object id found");
	}
	admins.findByIdAndRemove(id).then((data)=>{
		if (!data) {
			return res.status(404).send("unable to delete admin");
		}
		res.status(200).send(data);
	}).catch((e)=>{
		res.status(404).send("e");
	})
}