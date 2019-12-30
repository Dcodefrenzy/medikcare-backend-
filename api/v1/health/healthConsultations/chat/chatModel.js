const mongoose = require("mongoose");
const {chatSessions} = require("../chatSessions/chatSessionsModel");



const chatSchema = mongoose.Schema({
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
        },
        receiver:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
        },
        message:{
            type:String,
            require:true,
        },
        delivery:{
            type:Boolean,
            require:true,
            default:false,
        },
        createdAt:{
            type:Date,
            default:Date.now,
        },
        sessionId:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            //ref:chatSessions,
        },
});

const chats = mongoose.model("chats", chatSchema);
module.exports = chats