const {ObjectID} = require('mongodb');
let {blogImages} = require("./imagesModel");
const _ = require('lodash');
const bcrypt = require("bcryptjs");
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
		cb(null, Date.now() + '-' +file.originalname )
	  }
  })
  const upload = multer({ storage: storage }, {limits: { fileSize: 2 }}).single('image');

   exports.updateImage =  (req, res, next) => {
		upload(req, res, function (err) {
			
			if (err instanceof multer.MulterError) {
				return res.status(500).json(err)
			} else if (err) {
				return res.status(500).json(err)
            }
            blogImage = new blogImages({
                filename:req.file.filename,
                path:req.file.path,
                _createdBy:req.admin._id,
                dateCreated: new Date,
            })
            console.log({"blogimage":blogImage})
            blogImage.save().then((image)=>{
                if (!image) {
                    console.log("err")
                const error = {status:403, message:"No image!"}
                return res.status(403).send(error);
                }else {
                    console.log({"newimgs":image})
                    blogImages.find().then((images)=>{
                        
                  image ={status:201, message:images}
                  res.status(201).send(image);
                    })
                }
            }).catch((e)=>{
                console.log(e)
                const error = {status:403, message:e}
                return res.status(403).send(error);
            })

	})
  }

  exports.fetchAllImages = (req, res)=>{
        blogImages.find().then(images=>res.status(200).send({"status":200,message:images}))
        .catch(e=>res.status(403).send({"status":403,message:e}))
  }