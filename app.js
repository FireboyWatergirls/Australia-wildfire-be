var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
const livereload = require('livereload');
var liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
var connectLivereload = require("connect-livereload");
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(async (ctx, next) => {  
  ctx.set("Access-Control-Allow-Origin", ctx.headers.origin);
  ctx.set("Access-Control-Allow-Credentials", true);  
  ctx.set("Access-Control-Request-Method", "PUT,POST,GET,DELETE,OPTIONS");  
  ctx.set(    "Access-Control-Allow-Headers", 
     "Origin, X-Requested-With, Content-Type, Accept, cc"  );  
  if (ctx.method === "OPTIONS") {    
    ctx.status = 204;    
    return;  
  }  await next();});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
