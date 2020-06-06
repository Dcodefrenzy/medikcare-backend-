const mongoose = require("mongoose");



const AppointmentSchema = mongoose.Schema({
        appointmentDate:{
            type:String,
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
        createdAt:{
            type:String,
        },
});

const appointments = mongoose.model("appointments", AppointmentSchema);
module.exports = {appointments}