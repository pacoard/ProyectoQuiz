
var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta "Quiz"

//Autoload de comentarios: verifica si existe el commentId
exports.load = function(req,res,next,commentId) {
	models.Comment.find({
			where: { id: Number(commentId) }
		}).then(function(comment) {
			if (comment) {req.comment = comment; next();}
			else next(new Error('No existe el comentario con ID='+commentId));
		}).catch(function(error) { next(error);});
};

//Get quizes/:quizId/comments/new
exports.new = function(req,res) {
	res.render('comments/new.ejs', { quizId: req.quiz.id, errors: []} );
};

//Post /quizes/:quizId/comments
exports.create = function(req,res) {
	var comment = models.Comment.build(
		{ texto: req.body.comment.texto,
		  QuizId: req.params.quizId
		});
	comment.validate().then(function(err) {
		if (err) res.render('comments/new.ejs', {comment: comment, errors: err.errors});
		else { //Se guarda el comentario en la BBDD
			comment.save().then(function(){
				res.redirect('/quizes/'+req.params.quizId);
			});
		}	
	}).catch(function(error){next(error)});
};

//Get quizes/:quizId/comments/:commentId/publish - si autoload redirige aquí
exports.publish  = function(req,res) {
	req.comment.publicado = true;
	req.comment.save( {fields: ["publicado"]})
		.then( function() {
			res.redirect('/quizes/'+req.params.quizId);
		}).catch(function(error) {next(error)});
};