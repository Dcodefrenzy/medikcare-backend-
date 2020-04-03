const {doctorsRecords} = require("./doctorsRecordsModel");
const {ObjectID} = require('mongodb');
const multer = require('multer');
const path = require('path');

require('dotenv').config()

let imgPath;
if ( process.env.DEV_ENV) {
	imgPath = "/../../../../client/public/Images";
}else{
	imgPath = "/../../../../client/build/Images"
}

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, path.join(__dirname, imgPath))
	},
	filename: function (req, file, cb) {
        const name = file.originalname.replace(/\s/g, '');
		cb(null, Date.now() + '-' +name)
	  }
  })
  
  const upload = multer({ storage: storage }, {limits: { fileSize: 2 }}).single('annualPracticingLicence');

  exports.updateAnnualPracticingLicence =  (req, res, next) => {
		upload(req, res, function (err) {
            const _doctorId= req.doctor._id;
            console.log(req.file)
			if (err instanceof multer.MulterError) {
				return res.status(500).json(err)
			} else if (err) {
				return res.status(500).json(err)
			}
			const annual = {filename:req.file.filename, mime:req.file.mimetype}

            doctorsRecords.findOneAndUpdate({_doctorId:_doctorId}, {$set: {annualPracticingLicence:annual}}, {new:true}).then((doctor)=>{
			if (!doctor) {
			const error = {status:403, message:"No user update!"}
			return res.status(403).send(error);
			}
			doctor ={status:201, message:"upload successful."}
			res.status(201).send(doctor);
		}).catch((e)=>{
			console.log(e)
			const error = {status:403, message:e}
			return res.status(403).send(error);
		})

	})
}



exports.addDoctorsRecords = (req, res, next)=> {
        console.log("Recieved New data for doctor records...")
        const doctorRecord = new doctorsRecords({
            address:"N/A",
            medicalSchool:"N/A",
            degree:"N/A",
            year:"N/A",
            specialty:"N/A",
            folioNumber:req.body.folioNumber,
            _doctorId:req.data._id,
           dateCreated: new Date,
    });
    doctorRecord.save().then((doctorRecord)=>{
        if(!doctorRecord){
            
            const err = {status:404, message:"unable to add doctor records"}
            return res.status(404).send(err);
        }else {
            console.log("Saved doctor records..");
            next();
        }
    }).catch((e)=>{
    let err ={}
    if(e.errors) {err = {status:403, message:e.errors}}
    else if(e){err = {status:403, message:e}}
    res.status(404).send(err);
    });     
    
}

exports.getDoctorsRecord = (req, res)=> {
    const _doctorId = req.params.id;
	if (!ObjectID.isValid(_doctorId)) {
        const err = {status:404, message:"No id found"}
        return res.status(404).send(err);
	}else{
        doctorsRecords.findOne({_doctorId:_doctorId})
        .populate("_doctorId")
        .exec((err, doctor)=>{
            if(err) {
                const err = {status:403, message:"We couldnt find doctor"}
                 res.status(403).send(err);
            }else{
                doctorDetails = {status:200, message:doctor}
               res.status(200).send(doctorDetails);
            }
        });
    }
}
exports.getDoctorRecord = (req, res)=>{
    _doctorId = req.doctor._id;
    console.log(_doctorId);
	doctorsRecords.findOne({_doctorId:_doctorId}).then((doctorsRecord)=>{
		if(!doctorsRecord) {
			const error = {status:404, message:"No Doctor record Found"}
			return res.status(404).send(error)
		}
		doctor = {status:200, doctorsRecord:doctorsRecord, message:req.doctor };
		res.status(200).send(doctor);
		
	}).catch((e)=>{
		res.status(404).send(e)
	})
}

exports.doctorRecords = (req, res, next)=> {
    doctorsRecords.find()
    .populate("_doctorId")
    .exec((err, doctors)=>{
        if(err) {
            const err = {status:403, message:"We couldnt find any doctors"}
             res.status(403).send(err);
        }else{
            console.log(doctors)
            allDOctors = {status:200, message:doctors}
           res.status(200).send(allDOctors);
        }
    });
}
exports.doctorUserRecord = (req, res, next)=> {
    _doctorId = req.params.id;
    doctorsRecords.findOne({_doctorId:_doctorId})
    .populate("_doctorId")
    .exec((err, doctors)=>{
        if(err) {
            const err = {status:403, message:"We couldnt find any doctor with this id"}
             res.status(403).send(err);
        }else{
            console.log({"here":doctors})
            allDOctors = {status:200, message:doctors}
           res.status(200).send(allDOctors);
        }
    });
}
exports.UpdatePersonalRecords = (req, res, next)=>{
	const _doctorId = req.doctor._id;

	doctorDetails = new doctorsRecords({
		year:  req.body.year,
		address: req.body.address,
		medicalSchool: req.body.medicalSchool,
        degree:  req.body.degree,
        folioNumber:  req.body.folioNumber,
        specialty:  req.body.specialty,
	})

	doctorsRecords.findOneAndUpdate({_doctorId:_doctorId}, {$set: {address:doctorDetails.address, degree:doctorDetails.degree, medicalSchool:doctorDetails.medicalSchool, year:doctorDetails.year, folioNumber:doctorDetails.folioNumber, specialty:doctorDetails.specialty,}}, {new: true}).then((doctorRecord)=> {
		if (!doctorRecord) {
			const err ={status:403, message:"Unable to update"};
			return res.status(403).send(err);	
		}
		req.data ={status:201,loggerUser:"User", logsDescription:"Personal information update  Successful",title:"Personal information update", _id:_doctorId}
		next();
	}).catch((e)=>{
		console.log(e)
		return res.status(403).send(e);
	})
}

