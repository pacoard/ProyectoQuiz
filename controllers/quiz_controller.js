//Modificado para soportar BBDD
var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta "Quiz"

//Get quizes/question
exports.question = function(req,res) {
	models.Quiz.findAll().then(function (quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta});
	})
};

//Get quizes/answer
exports.answer = function(req,res) {
	models.Quiz.findAll().then(function (quiz) {
		if (req.query.respuesta === quiz[0].respuesta)
			res.render('quizes/answer', {respuesta: 'Correcto'});
		else 
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
	})
};