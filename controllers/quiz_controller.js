//Modificado para soportar BBDD
var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta "Quiz"

//Quiz 10: Autoload. Factoriza el código si la ruta incluye :quizId
exports.load = function(req,res,next,quizId) {
	models.Quiz.find(quizId).then( 
		function(quiz) {
			if (quiz) { req.quiz = quiz; next(); }
			else next(new Error('No existe el quiz con ID='+quizId));
		}).catch(function(error) { next(error);});
};

//Get /quizes
exports.index = function(req,res) {
	if (req.query.busqueda != null) {
		var search = '%'+req.query.busqueda+'%'; //para buscar palabras intermedias
		models.Quiz.findAll({where: ["pregunta like ?", search]})
		.then(function (quizes) {
			res.render('quizes/index', {quizes: quizes});
		});
	}
	else {
		models.Quiz.findAll().then(function (quizes) {
			res.render('quizes/index', {quizes: quizes});
		});
	}
};
//Get /quizes/:id
exports.show = function(req,res) { //para la lista de preguntas
	//models.Quiz.find(req.params.quizId).then(function (quiz) {
	//	res.render('quizes/show', {quiz: quiz});
	//})
	res.render('quizes/show', { quiz: req.quiz} );
};

//Get quizes/answer
/*exports.answer = function(req,res) {
	models.Quiz.find(req.params.quizId).then(function (quiz) {
		if (req.query.respuesta === quiz.respuesta)
			res.render('quizes/answer', {respuesta: 'Correcto', quizId: req.params.quizId});
		else 
			res.render('quizes/answer', {respuesta: 'Incorrecto', quizId: req.params.quizId});
	})
};*/

exports.answer = function(req,res) {
	if (req.query.respuesta === req.quiz.respuesta)
		res.render('quizes/answer', {respuesta: 'Correcto', quizId: req.quiz.id});
		
	else res.render('quizes/answer', {respuesta: 'Incorrecto', quizId: req.quiz.id});
};