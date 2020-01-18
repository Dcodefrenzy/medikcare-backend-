let mongoose = require("mongoose");
mongoose.promise = global.promise;


mongoose.connect('mongodb://localhost/medikcare', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


module.exports = {mongoose};