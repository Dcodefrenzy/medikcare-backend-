let mongoose = require("mongoose");
mongoose.promise = global.promise;


mongoose.connect('mongodb://dbname/medikCare', {useNewUrlParser: true }).catch(err => console.log(err));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


module.exports = {mongoose};