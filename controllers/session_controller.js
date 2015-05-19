//Autologout
exports.sessionExpired = function(req,res,next) {
	var date = new Date();
	var diferencia = date.getSeconds() - req.session.time; 
	if(diferencia >= 10) {
		delete req.session.user;
		res.redirect(req.session.redir.toString());
	}
	else {
		req.session.time = date.getSeconds();
		next();
	}
};

//AUTORIZACIÓN

//Contador de sesión
exports.tiempo = function(next) {
	var date = new Date();
	return date.getSeconds();
}

exports.loginRequired = function(req,res,next) {
	if (req.session.user) next();
	else res.redirect('/login');
};

// Get /login 
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('sessions/new', {errors: errors});
};

// POST /login (se crea la sesión)
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;
	var userController = require('./user_controller');
	
	userController.autenticar(login, password, function(error, user) {
		if (error) { // si hay error retornamos mensajes de error de sesión
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;
		}
		// Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user
		req.session.user = {id: user.id, username: user.username, isAdmin: user.isAdmin};
		var date = new Date();
		req.session.time = date.getSeconds();
		res.redirect(req.session.redir.toString());// redirección a path anterior a login
	});
};

// DELETE /logout
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};