const mongoose = require("mongoose");



const AppointmentSchema = mongoose.Schema({
        appointmentDate:{
            type:Date,
            require:true,
        },
        start:{
            type:Boolean,
            default:false,
        },
        doctor:{
            type:String,
            require:true,
        },
        user:{
            type:String,
            require:true,
        },
        sessionId:{
            type:String,
            require:true,
        },
        cancel:{
            type:Boolean,
            default:false,
        },
        createdAt:{
            type:Date,
            default:Date.now,
        },
});

const appointments = mongoose.model("appointments", AppointmentSchema);
module.exports = {appointments}