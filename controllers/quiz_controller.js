//Modificado para soportar BBDD
var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta "Quiz"

/*
//Get quizes/question
exports.question = function(req,res) {
	models.Quiz.findAll().then(function (quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta});
	})
};*/
//Get /quizes
exports.index = function(req,res) {
	models.Quiz.findAll().then(function (quizes) {
		res.render('quizes/index', {quizes: quizes});
	})
};
//Get /quizes/:id
exports.show = function(req,res) { //para la lista de preguntas
	models.Quiz.find(req.params.quizId).then(function (quiz) {
		res.render('quizes/show', {quiz: quiz});
	})
};

//Get quizes/answer
exports.answer = function(req,res) {
	models.Quiz.find(req.params.quizId).then(function (quiz) {
		if (req.query.respuesta === quiz.respuesta)
			res.render('quizes/answer', {respuesta: 'Correcto', quizId: req.params.quizId});
		else 
			res.render('quizes/answer', {respuesta: 'Incorrecto', quizId: req.params.quizId});
	})
};