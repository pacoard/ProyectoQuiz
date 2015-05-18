//Importar middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

//Importar enrutadores
var routes = require('./routes/index');
//var users = require('./routes/users');
//Crear aplicación
var app = express();

//Instalar vistas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

//Instalar middlewares
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded()); //ahora se parsea bien
app.use(cookieParser('Quiz 2015')); //ahora cifra cookie
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Autenticación y sesión
app.use(function(req,res,next) {
    //si no existe la redireción, se inicializa a /
    if (!req.session.redir)
        req.session.redir = '/';
    //guardar path en session.redir para despues del login
    if (!req.path.match(/\/login|\/logout|\/user/))
        req.session.redir = req.path;

    //hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

//Instalar enrutadores y asociar rutas a sus gestores
app.use('/', routes);

// Para el resto de rutas, catch 404 y se pasa el error al error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//---------------------Error handlers----------------------------

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

//Exportar aplicación para que se pueda arrancar desde bin/www
module.exports = app;
