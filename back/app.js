var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// LIBS AUTH
var rateLimit = require("express-rate-limit");
var session = require('express-session');


var app = express();
app.use(express.json())

// CONFIGURAÇÃO DE LIMITE DE REQUISIÇÕES
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 100 requests per windowMs,
  keyGenerator: (req, res)=> req.headers['x-forwarded-for'] || req.ip
});

// CONFIGURAÇÃO DE SESSÃO
app.use(session({
  secret: '8c10472423dc7ac1b8fdb91c96793ae8d385da1af1a334950f9f22dbef19edad',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// IMPORTE DAS ROTAS /ROUTES...
var indexRouter = require('./routes/index');
var professorRouter = require('./routes/professor');
var alunoRouter = require('./routes/aluno');
var authRouter = require('./routes/auth');

// DEFINI OS ENDPOINT//RECURSO PARA AS ROTAS
app.use('/', indexRouter);
app.use('/professor', professorRouter);
app.use('/aluno', alunoRouter);
app.use('/auth', limiter, authRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
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
  res.send({erro:'Not found'});
});

module.exports = app;
