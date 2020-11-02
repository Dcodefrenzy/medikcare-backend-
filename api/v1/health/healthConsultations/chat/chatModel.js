const mongoose = require("mongoose");
const {chatSessions} = require("../chatSessions/chatSessionsModel");



const chatSchema = mongoose.Schema({
        sessionStart:{
            type:Boolean
        },
        sessionEnd:{
            type:Boolean,
        },
        complain:{
            type:String,
            require:true,
        },
        means: {
            type:String,
            require:true,
            default:"chat"
        },
        emergencyLevel:{
            type:Number,
            require:true,
            default:false,
        },
        createdAt:{
            type:Date,
            default:Date.now,
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            //ref:chatSessions,
        },
});

const chats = mongoose.model("chats", chatSchema);
module.exports = chats