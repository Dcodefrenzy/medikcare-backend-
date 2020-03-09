const {answers} = require("./answersModel");



exports.addAnswer = (req, res, next)=>{
    const id = req.params.ansId;
    answer = new answers({
        answer:req.body.answer,
        _questionId:id,
        _doctorId:req.doctor._id,
        deleteAnswer:false,
    })
    answer.save().then((answer)=>{
        if(!answer) {
            const err = {status:403, message:"Something went wrong unable to save your answer."}
            return res.status(403).send(err);
        }else{
            const answer = {status:201,_questionId:id,_idTo:req.doctor._id, message:"Your-answer-has-been-saved-successfuly-Thank-you."}
			req.data = answer;
			req.data.loggerUserTo = "Doctor";
			req.data.logsDescriptionTo = "A question has been resopnded to a question please comfirm";
            req.data.title = "Answer";
			next();
        }
    }).catch((e)=>{
        console.log(e)
        res.status(403).send(e);
    })
}

exports.GetAnswers = (req, res)=>{
    answers.find({deleteAnswer:false}).then((answers)=>{
        req.data.answers = answers;
        res.status(200).send(req.data);
    }).catch((e)=>{
        res.status(403).send(e);
    });
}

exports.GetQuestionAnswers = (req, res, next)=>{
    const id = req.data.question._id
    const bool = false;
    answers.find({_questionId:id, deleteAnswer:bool},  null, {sort: {_id: -1}})
    .populate("_doctorId")
    .exec((err, answers)=>{
        console.log(err)
        if(err) {
            const err = {status:403, message:"We couldnt find any Answers at this time"}
             res.status(403).send(err);
        }else{
            req.data.answers = answers;
           res.status(200).send(req.data);
        }
    });
}

exports.usersThankYou = (req, res, next)=>{
    const thankYou = [{_userId:req.user._id}];
        const id = req.params.id;
        answers.findByIdAndUpdate({_id:id},{$push: {thankYou:thankYou}}, {new:true}).then((answer)=>{
                if(!answer) {
                    const err = {status:403, message:"We couldnt find any Answers at this time"}
                    res.status(403).send(err);
                }else {
                    const answerData = {status:201, _id:req.user._id,_questionId:answer._questionId}
                    req.data = answerData;
                    req.data.loggerUser = "User";
                    req.data.logsDescription = "Said Thank you to an answer";
                    req.data.title = "SayThankYou-Answer";
                    console.log(req.data)
                    next();
                }
        }).catch((e)=>{
         console.log(e)
            res.status(403).send(e)
        });
}

exports.doctorAgrees = (req, res, next)=>{
 
    const agrees = [{_doctorId:req.doctor._id}];
    const id = req.params.id;
    answers.findByIdAndUpdate({_id:id}, {$push:{agrees:agrees}}, {new:true}).then((answer)=>{
        if(!answer){
            const err = {status:403, message:"We couldnt find any Answers at this time"}
            res.status(403).send(err);
        }else{
            const answerData = {status:201, _id:req.doctor._id,_questionId:answer._questionId}
            req.data = answerData;
            req.data.loggerUser = "Doctor";
            req.data.logsDescription = "Agrees to an answer";
            req.data.title = "Agrees-Answer";
            console.log(req.data)
            next();
        }
    }).catch((e)=>{
        console.log(e)
        res.status(403).send(e)
    });
}

exports.getMetricsAnswers=(req, res, next)=>{
	answers.countDocuments().then((count)=>{
		req.metric.answerMetric = count;
		next();
	})
}

exports.getAnswersById=(req, res)=>{
    const _id = req.params.id;
    answers.findById(_id).then((answer)=>{
        if (!answer) {
            const err = {status:403, message:"We couldnt find any Answers at this time"}
            res.status(403).send(err);
        }else if(answer.deleteAnswer === true){
            const err = {status:403, message:"This answer has been deleted"}
            res.status(403).send(err);
        }else{
          
        res.status(200).send({status:200, message:answer});  
        }
    }).catch((e)=>{
        
        console.log(e)
        res.status(403).send(e)
    })
}

exports.deleteAnswerById = (req, res,next)=>{
    const _id = req.params.id;
    answers.findByIdAndUpdate({_id:_id}, {$set :{deleteAnswer:true}}, {new:true}).then((answer)=>{
        if (!answer) {
            const err = {status:403, message:"We couldnt find any Answers at this time"}
            res.status(403).send(err);
        }else{
        const answer = {status:201,_id:req.doctor._id, message:"Your answer has been successfully deleted."}
        
        req.data = answer;
        req.data.loggerUser = "Doctor";
        req.data.logsDescription = "You just deleted an answer.";
        req.data.title = "Answer"; 
        next();
        }
    }).catch((e)=>{
        
        console.log(e)
        res.status(403).send(e)
    })
}

exports.updateAnswerById = (req, res,next)=>{
    const _id = req.params.id;
    answers.findByIdAndUpdate({_id:_id}, {$set :{answer:req.body.answer}}, {new:true}).then((answer)=>{
        if (!answer) {
            const err = {status:403, message:"We couldnt find any Answers at this time"}
            res.status(403).send(err);
        }else if(answer.deleteAnswer === true){
            const err = {status:403, message:"This answer has been deleted"}
            res.status(403).send(err);
        }else{

            const answer = {status:201,_id:req.doctor._id, message:"Your answer has been Updated successfuly Thank you."}
			req.data = answer;
			req.data.loggerUser = "Doctor";
			req.data.logsDescription = "You just updated an answer";
            req.data.title = "Answer"; 
            next();
        }
    }).catch((e)=>{
        
        console.log(e)
        res.status(403).send(e)
    })
}