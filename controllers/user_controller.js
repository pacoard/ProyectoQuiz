//Controlador para los usuarios
var models = require('../models/models.js');

//Quiz 22: autorización para editar quiz (si éste pertenece al usuario, o si el usuario es admin)
exports.ownershipRequired =  function(req,res,next) {
	var objUser = req.user.id; //id de usuario propietario del quiz
	var logUser = req.session.user.id; //id de usuario que intenta editar el quiz
	var isAdmin = req.session.user.isAdmin; //booleano para ver si el usuario es el admin

	if (isAdmin || objUser === logUser)
		next();
	else
		res.redirect('/');
};

// Autoload :id
exports.load = function(req, res, next, userId) {
	models.User.find({where: {id: Number(userId)}})
	.then(function(user) {
		if (user) {req.user = user;next();} 
		else{next(new Error('No existe userId=' + userId))}
	}
	).catch(function(error){next(error)});
};

// Verifica si el usuario existe. Si no, se llama a callback
exports.autenticar = function(login, password, callback) {
	models.User.find({where: {username: login}})
	.then(function(user) {
		if (user) {
			if(user.verifyPassword(password))
				callback(null, user);
			else 
				callback(new Error('Password erróneo.'));
		} 
		else { 
			callback(new Error('No existe el usuario ' + login));
		}
	}).catch(function(error){callback(error)});
};

// GET /user/:id/edit
exports.edit = function(req, res) {
	res.render('user/edit', { user: req.user, errors: []});
}; // req.user: instancia de user cargada con autoload

// GET /user
exports.new = function(req, res) {
	//Se crea el usuario, y se guarda su fila correspondiente en
	//la base de datos en esta variable
	var user = models.User.build({username: "", password: ""});
	res.render('user/new', {user: user, errors: []});
};

// POST /user
exports.create = function(req, res) {
	var user = models.User.build( req.body.user );
	user.validate().then(function(err){
		if (err) 
			res.render('user/new', {user: user, errors: err.errors});
		else {// save: guarda en DB campos username y password de user
			user.save({fields: ["username", "password"]})
			.then( function(){// crea la sesión para que el usuario acceda ya autenticado y redirige a /
				req.session.user = {id:user.id, username:user.username};
				res.redirect('/');
			});
		}
	}).catch(function(error){next(error)});
};

// PUT /user/:id
exports.update = function(req, res, next) {
	req.user.username = req.body.user.username;
	req.user.password = req.body.user.password;
	req.user.validate().then(function(err){
		if (err) 
			res.render('user/' + req.user.id, {user: req.user, errors: err.errors});
		else {// save: guarda campo username y password en DB
			req.user .save( {fields: ["username", "password"]})
			.then( function(){ res.redirect('/');});
		} 
	}).catch(function(error){next(error)});
};

// DELETE /user/:id
exports.destroy = function(req, res) {
	req.user.destroy().then( function() {// borra la sesión y redirige a /
		delete req.session.user;
		res.redirect('/');
	}).catch(function(error){next(error)});
};
