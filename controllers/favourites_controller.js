var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta todas las tablas de la BBDD
//Hacer middlewares GET, PUT y DELETE
exports.index = function(req,res, next) {
		req.user.getFavourites().then(function(quizesFavoritos) {
			for (var i=0; i<quizesFavoritos.length; i++)
				quizesFavoritos[i].isFavourite == true;

			res.render('quizes/index.ejs', {quizes: quizesFavoritos, errors: []});
	}).catch(function(error) {next(error)});
};

exports.new = function(req,res, next) {
	req.user.addFavourites(req.quiz)
		.then(function() {
			console.log("----------marcado favorito---------");
			res.render('/users/'+req.user.id+'/quizes'); //llamar a show de quiz controller
		}).catch(function(error) { next(error);});
};

exports.delete = function(req,res, next) {
	req.user.removeFavourites(req.quiz)
		.then(function() {
			console.log("----------desmarcado favorito---------");
			res.render('/users/'+req.user.id+'/quizes');//llamar a show de quiz controller
		}).catch(function(error) { next(error);});
};
