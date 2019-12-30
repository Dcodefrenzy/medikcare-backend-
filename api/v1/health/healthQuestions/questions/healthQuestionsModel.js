const mongoose = require("mongoose");
const {users} = require("../../../users/usersModel");


healthQuestionsSchema = mongoose.Schema ({
    topic: {
        type:String,
        require:true,
    },
    description: {
        type:String,
        require:true,
    },
    image: {
        type:Buffer,
        require:false,
    },
    createdAt: {
        type:Date,
        default:Date.now,
        require:true,
    },
    updatedAt: {
        typ:Date,
        require:false,
    },
    _userId: {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:users,
    },
});

const healthQuestions = mongoose.model('healthQuestions', healthQuestionsSchema);

module.exports = {healthQuestions};

