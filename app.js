const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require("./module/db");
const mqtt = require('./module/mqtt');
const moment = require('moment');
let arr = new Array();

const indexRouter = require('./routes/index');

setInterval( async function(){
  let tempWater =  await mqtt.mqttFun();    
  

  console.log(tempWater);
  let selectQuery = `
  SELECT water.usage
  FROM water
  WHERE user_idx = ? ORDER BY write_time DESC `;
  let selectResult = await db.queryParamArr(selectQuery,[1]);
  if(selectResult[0].usage != tempWater||tempWater===0.0){
  let updateQuery = `INSERT INTO water(water.usage,write_time,user_idx) VALUES (?,?,?)`;
  let updateResult = await db.queryParamArr(updateQuery,[tempWater,moment().format("YYYY-MM-DD HH:mm:ss"),1]);
  console.log(updateResult);
  
  
  }
},10000);




const app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - logger
app.use(logger('dev'));
//middleware - body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//middleware - cookie-parser
app.use(cookieParser());
//middleware - static
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

//middleware - error-handler
app.use((err, req, res, next) => {
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  //render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
