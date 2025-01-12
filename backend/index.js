require('dotenv').config();//env variables
const express = require('express');
//const session = require('cookie-session');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const port = process.env.PORT || 8000;
const path = require('path');
const http = require('http');
const cors=require("cors");

const server = http.createServer(app);
////ROUTES\\\\
const uploadRoute = require('./routes/upload');
const queryRoute = require('./routes/query');

//\\ROUTES////   We use routes so that multiple contributors can work on the backend simultaneously.
const corsOptions = {
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions)) 
app.use(express.json());
app.use('/static', __dirname + express.static('/img'))
app.use('/api/upload', uploadRoute);
app.use('/api/query', queryRoute);

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../frontend/build/')});
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});






