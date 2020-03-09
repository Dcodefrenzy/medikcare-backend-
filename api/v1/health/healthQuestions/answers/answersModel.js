const mongoose = require("mongoose");
const {healthQuestions} = require("../questions/healthQuestionsModel");
const {users} = require("../../../users/usersModel");
const {doctors} = require("../../../medicals/doctors/doctor/doctorsModel");

answersSchema = mongoose.Schema({
    answer: {
        type:String,
        require:true,
    },
    image: {
        type:Buffer,
        require:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        require:true,
    },
    updatedAt:{
        type:Date,
        require:false,
    },
    thankYou: [{
           _userId: {
            type:mongoose.Schema.Types.ObjectId,
            require:false,
        },
    }],
    agrees: [{
        _doctorId:{
            type:mongoose.Schema.Types.ObjectId,
            require:false,
        },
    }],
    
    disagrees: [{
        _doctorId:{
            type:mongoose.Schema.Types.ObjectId,
            require:false,
        },
    }],
    _questionId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:healthQuestions,
    },
    _doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:doctors,
    },
    deleteAnswer :{
        type:Boolean,
        require:true,
    },
})

const answers = mongoose.model('answers', answersSchema);

module.exports = {answers};