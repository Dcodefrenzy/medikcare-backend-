const {ObjectID} = require('mongodb');
let {blogs} = require("./blogModel.js");
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

exports.saveBlog = (req, res, next)=>{
    const blog = new blogs({
        topic:req.body.topic,
        article:req.body.article,
        category:req.body.category,
        _createdBy:req.admin._id,
        dateCreated:new Date(),

    });
    blog.save().then((blog)=>{
        const blogItem = {status:201,topic:blog.topic, category:blog.category, article:blog.article, _id:blog._createdBy, blogId:blog._id,}
        req.data = blogItem;
		req.data.loggerUser = "Admin";
		req.data.logsDescription = `Admin ${req.admin.firstname+" "+req.admin.lastname} added a new blog article called ${blog.topic}`;
        req.data.title = "Blog";
        
        next();
    }).catch((e)=>{
        console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
}

exports.getAllBlogs = (req, res,next)=>{
    blogs.find({deleteArticle:false}).then((blog)=>{
        req.blogs = {status:200, message:blog};
        next();
    })
}



exports.getBlog = (req, res, next)=>{
   const _id = req.params.id;
    blogs.findById({_id:_id,deleteArticle:false}).then(blog=>{
        if (!blog) {
            const error = {status:403, message:"Could not find blog"}
            return res.status(403).send(error);
        }else {
            req.blog = {status:200, message:blog};
            next();
        }
    }).catch(e=>res.status(403).send({status:403, message:"Could not find blog"}));
}

exports.updateBlog=(req, res, next)=>{
    const _id = req.params.id
    blogs.findByIdAndUpdate(_id, {$set: {topic:req.body.topic, article:req.body.article, category:req.body.category, dateUpdated:new Date(), _updatedBy:req.admin._id }}, {new: true})
        .then((blog)=>{
            if (!blog) {
                const error = {status:403, message:"Could not find blog"}
                return res.status(403).send(error);
            }else {
                
        const blogItem = {status:201,topic:blog.topic, category:blog.category, article:blog.article, _id:req.admin._id, blogId:blog._id,}
        req.data = blogItem;
		req.data.loggerUser = "Admin";
		req.data.logsDescription = `Admin ${req.admin.firstname+" "+req.admin.lastname} updated article ${blog.topic}`;
        req.data.title = "Blog";
        
        next();
        }
        }).catch((e)=>{
            console.log(e)
            res.status(403).send({status:403, message:"Unable to update blog."})
        });
}

exports.updateImage =  (req, res, next) => {
    upload(req, res, function (err) {

            const _id = req.params.id;
			if (err instanceof multer.MulterError) {
				return res.status(500).json(err)
			} else if (err) {
				return res.status(500).json(err)
			}
            const image = {filename:req.file.filename, path:req.file.path}
            
        blogs.findByIdAndUpdate(_id, {$set: {image:image}}, {new:true}).then((blog)=>{
            if (!blog) {
            const error = {status:403, message:"No blog image added"}
             res.status(403).send(error);
            }else {
                const blogItem = {status:201,topic:blog.topic, category:blog.category, article:blog.article, _id:req.admin._id, blogId:blog._id,}
                req.data = blogItem;
                req.data.loggerUser = "Admin";
                req.data.logsDescription = `Admin ${req.admin.firstname+" "+req.admin.lastname} updated article ${blog.topic} Image`;
                req.data.title = "Blog";
                
                next();
            }
        }).catch((e)=>{
            console.log(e)
            const error = {status:403, message:e}
            return res.status(403).send(error);
        })
    })
}

exports.deleteBlog=(req, res, next)=>{
    let pusblish;
    const _id = req.params.id;
    if (req.body.deleteArticle === true) {
        pusblish = "Unpublish"
    }else{
        pusblish = "Published"
    }
    blogs.findByIdAndUpdate({_id:_id},{$set: {deleteArticle:req.body.deleteArticle, deletedBy:req.admin._id}}, {new:true})
    .then((blog)=>{
        if (!blog) {
            const error = {status:403, message:"Could not find blog to delete"}
            return res.status(403).send(error);
        }else {
            const blogItem = {status:201,topic:blog.topic, category:blog.category, article:blog.article, _id:req.admin._id, blogId:blog._id,}
                req.data = blogItem;
                req.data.loggerUser = "Admin";
                req.data.logsDescription = `Admin ${req.admin.firstname+" "+req.admin.lastname} just ${pusblish} article ${blog.topic} Image`;
                req.data.title = "Blog";
                
                next();
        }
    }).catch(e=>res.status(403).send({status:403, message:"Could not find blog to delete"}));
}

exports.getBlogForUsers = (req, res, next)=>{
    
   const _id = req.params.id;
   blogs.findById(_id).then(blog=>{
       if (!blog) {
           const error = {status:403, message:"Could not find blog"}
           return res.status(403).send(error);
       }else {
        const blogArticle = blog.article.slice(0, 500).replace(/<[^>]+>/g, '');
        const blogItem = {status:201,topic:blog.topic, category:blog.category, article:blogArticle, _id:req.admin._id, blogId:blog._id,}
        req.data = blogItem;
        next();
       }
   }).catch(e=>res.status(403).send({status:403, message:"Could not find blog"}));
}