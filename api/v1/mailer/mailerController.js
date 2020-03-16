const {ObjectID} = require('mongodb');
let {maillers} = require("./maillerModel");

require('dotenv').config()


exports.saveMailler = (req, res, next)=>{
    const mailler = new maillers({
        topic:req.body.topic,
        message:req.body.message,
        _createdBy:req.admin._id,
        dateCreated:new Date(),

    });
    mailler.save().then((mailler)=>{
        const maillerItem = {status:201,topic:mailler.topic, message:mailler.message, _id:mailler._createdBy, maillerId:mailler._id,}
        req.data = maillerItem;
		req.data.loggerUser = "Admin";
		req.data.logsDescription = `Admin ${req.admin.firstname+" "+req.admin.lastname} added a new mail message called ${mailler.topic}`;
        req.data.title = "Mailler";
        
        next();
    }).catch((e)=>{
        console.log(e)
		let err ={}
		if(e.errors) {err = {status:403, message:e.errors}}
		else if(e){err = {status:403, message:e}}
		res.status(403).send(err);
	});
}


exports.getAllMaillers = (req, res,next)=>{
    maillers.find({deleteMessage:false}).then((mailler)=>{
        req.data = {status:200, message:mailler};
        next();
    })
}

exports.getMailler = (req, res, next)=>{
    const _id = req.params.id;
     maillers.findById({_id:_id,deleteMessage:false}).then(mailler=>{
         if (!mailler) {
             const error = {status:403, message:"Could not find mail"}
             return res.status(403).send(error);
         }else {
             req.data = {status:200, message:mailler};
             next();
         }
     }).catch(e=>res.status(403).send({status:403, message:"Could not find mail message"}));
 }

 exports.updateMailler=(req, res, next)=>{
    const _id = req.params.id
    maillers.findByIdAndUpdate(_id, {$set: {topic:req.body.topic, message:req.body.message,  dateUpdated:new Date(), _updatedBy:req.admin._id }}, {new: true})
        .then((mailler)=>{
            if (!mailler) {
                const error = {status:403, message:"Could not find mail"}
                return res.status(403).send(error);
            }else {
                
        const maillerItem = {status:201,topic:mailler.topic, message:mailler.message, _id:req.admin._id, maillerId:mailler._id,}
        req.data = maillerItem;
		req.data.loggerUser = "Admin";
		req.data.logsDescription = `Admin ${req.admin.firstname+" "+req.admin.lastname} updated Mail message ${mailler.topic}`;
        req.data.title = "Mailer";
        
        next();
        }
        }).catch((e)=>{
            console.log(e)
            res.status(403).send({status:403, message:"Unable to update mail."})
        });
}
 

exports.deleteMailler=(req, res, next)=>{
    const _id = req.params.id;
    maillers.findByIdAndUpdate({_id:_id},{$set: {deleteMessage:true, deletedBy:req.admin._id}}, {new:true})
    .then((mailler)=>{
        if (!mailler) {
            const error = {status:403, message:"Could not find mail"}
            return res.status(403).send(error);
        }else {
            
    const maillerItem = {status:201,topic:mailler.topic, message:mailler.message, _id:req.admin._id, maillerId:mailler._id,}
    req.data = maillerItem;
    req.data.loggerUser = "Admin";
    req.data.logsDescription = `Admin ${req.admin.firstname+" "+req.admin.lastname} Delete Mail ${mailler.topic}`;
    req.data.title = "Mailer";
    
    next();
    }
    }).catch(e=>res.status(403).send({status:403, message:"Could not find mail to delete"}));
}


exports.updateMaillerSent=(req, res, next)=>{
    const _id = req.params.id
    maillers.findByIdAndUpdate(_id, {$set: {mailerSent:true}, $inc: { maillerNumber: 1 }}, {new: true})
        .then((mailler)=>{
            if (!mailler) {
                const error = {status:403, message:"Could not find mail"}
                return res.status(403).send(error);
            }else {
                
        const maillerItem = {status:201,topic:mailler.topic, message:mailler.message, _id:req.admin._id, maillerId:mailler._id,}
        req.data = maillerItem;
		req.data.loggerUser = "Admin";
		req.data.logsDescription = `Admin ${req.admin.firstname+" "+req.admin.lastname} Sent Mail message ${mailler.topic}`;
        req.data.title = "Mailer";
        
        next();
        }
        }).catch((e)=>{
            console.log(e)
            res.status(403).send({status:403, message:"Unable to update mail."})
        });
}