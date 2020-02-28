const {healthQuestions} = require("./healthQuestionsModel");
const {ObjectID} = require('mongodb');


exports.addQuestion  = (req, res, next)=> {
       const question = new healthQuestions({
                    topic: req.body.topic,
                    description: req.body.description,
                    _userId: req.user._id,
        });
        question.save().then((question)=>{
            if(!question){
                const err = {status:403, message:"Unable to add question."}
                return res.status(403).send(err);
            }else{
                const questionData = {status:201,_id:question._userId, message:"Your-question-has-been-pass-accross-to-our-pool-of-doctors,-you-will-recieve-a-reply-soon,-please-put-on-your-notifications."}
               req.data = questionData;
               req.data.loggerUser = "Patient";
                req.data.logsDescription = "Added a new question.";
                req.data.title = "Qustion";
                next();
            }
        }).catch((e)=>{
            res.status(403).send(e);
        })
}

exports.getAllQuestion = (req, res, next) => {
    healthQuestions.find().then((questions)=>{
        if(!questions) {
            const err = {status:403, message:"We couldnt find any questions at this time"}
            return res.status(403).send(err);
        }else {
            
             req.data = {status:200, questions:questions};
            next();
        }
    }).catch((e)=>{
        res.status(403).send(e);
    });
}

exports.getQuestion = (req, res, next) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        const err = {status:404, message:"No id found"}
        return res.status(404).send(err);
	}
    healthQuestions.findOne({_id:id}).then((question)=>{
        if (!question) {
            const err = {status:404, message:"No quesions found"}
            return res.status(404).send(err);
        }else{
            req.data = {status:200, question:question};
            next();
        }
    }).catch((e)=>{
       res.status(403).send(e);
    });
}


exports.getQuestionMetrics = (req, res, next)=>{
	healthQuestions.countDocuments().then((count)=>{
		req.metric.questionMetric = count;
		next();
	})
}
