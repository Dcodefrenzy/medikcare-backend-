const mongoose = require("mongoose");
const {doctors} = require("../doctor/doctorsModel");



doctorsRecordsSchema = mongoose.Schema({
    country: {
        type:Number,
        required: false,
    },
    state: {
        type: Number,
        required: false,
    },
    localGovernment: {
        type: Number,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    medicalSchool: {
        type:String,
        require:false,
    },
    degree: {
        type:String,
        require:false,
    },
    year: {
        type:String,
        require:false,
    },
    specialty:{
        type:String,
        require:true,
    },
    folioNumber: {
        type:String,
        require:true,
    },
    annualPracticingLicence: {
        filename:{
			type:String,
			required:false,
		},
		mime:{
			type:String,
			required:false,
		}
    },
    dateCreated:{
        type:String,
        require:true,
    },
    dateUpdated:{
        type:Date,
        require:false,
    },
    _doctorId: {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:doctors,
    },
});


const doctorsRecords = mongoose.model('doctorsRecords', doctorsRecordsSchema);

module.exports = {doctorsRecords};