const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require('multer');
const cors = require("cors");
const morgan = require("morgan");
const api = require("./api/v1/api.js");

require('dotenv').config()


const coreOptions = {
	origin: "http://localhost:3000", 
	optionsSuccessStatus: 200
}

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(morgan('dev'));
app.use(cors(coreOptions));
 app.use("/api/v1", api); 



 app.listen(5858, function(){
	console.log("started at port 5858");
});

