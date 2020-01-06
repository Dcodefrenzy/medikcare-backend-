const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require('multer');
const cors = require("cors");
const morgan = require("morgan");
const api = require("./api/v1/api.js");

require('dotenv').config()


const whitelist = ['https://www.medikcare.com/','http://www.medikcare.com/', "http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(morgan('dev'));
app.use(cors(coreOptions));
 app.use("/api/v1", api); 





app.listen(3000, function(){
	console.log("started at port 3000");
});

