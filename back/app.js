var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var rateLimit = require('express-rate-limit');
var session = require('express-session');


var app = express();
app.use(express.json())

//CONFIG DE LIMITE DE REQUISIÇOES

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: (req, res) => req.headers['x-forwarded-for'] || req.ip
});

//CONFIG DA SESSÃO

app.use(session({
  secret: '408e0135f57bebc614c26b4f6afda7637efd027a7d0c26f6ab6904ddf69741d5', //onda tec
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false }
}));

// IMPORT DAS ROTAS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var petsRouter = require('./routes/pets');
var authRouter = require('./routes/auth');

// DEFINE ENDPOINTS PARA ROTAS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pets', petsRouter);
app.use('/auth', limiter, authRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({erro: 'Not Found'});
});

module.exports = app;
