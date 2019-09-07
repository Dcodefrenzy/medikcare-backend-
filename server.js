const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const api = require("./api/v1/api.js");



app.use(bodyparser.json());
app.use("/api/v1", api);

//express.static help serve all the file in the whole www folder
app.use(express.static(__dirname + "/www"));


app.listen(8080, (err)=>{
	if (err) {
		return err;
	}
	console.log("starting at port 3000");
});


module.exports = {app}; 