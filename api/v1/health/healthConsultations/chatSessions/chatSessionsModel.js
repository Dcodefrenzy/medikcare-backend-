const mongoose = require("mongoose");
const {users} = require("../../../users/usersModel");
const {doctors} = require("../../../medicals/doctors/doctor/doctorsModel");


const chatSessionsSchema = mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            ref:users,
        },
        doctorId:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            ref:doctors,
        },
        start:{
            type:Date,
            require:true,
            default:Date.now,
        },
        end:{
            type:Date,
            require:false,
        },
        endSession:{
            type:Boolean,
            require:true,
            default:false,
        },
});

const chatSessions = mongoose.model("chatSessions", chatSessionsSchema);
module.exportsc= chatSessions;

