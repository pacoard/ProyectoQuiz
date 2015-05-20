
var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta todas las tablas de la BBDD
// Se importa de models.js: Quiz, Comment y User

//Cálculo de las estadísticas
exports.cargar = function(req,res) {
	
	models.Quiz.findAll().then(function (quizes){
		models.Comment.findAll().then(function (comments) {
			var nPreguntas = 0, 
				nComments = 0, 
				nMedioComments = 0, 
				nPreguntasSinComments = 0, 
				nPreguntasConComments = 0;

			nComments = comments.length;
			nPreguntas = quizes.length;
			nMedioComments = nComments/nPreguntas;

			for (var i=1; i<=nPreguntas; i++) {
				for (var j=0; j<nComments; j++) {
					if (comments[j].QuizId === i) {
						nPreguntasConComments++;
						break;
					}
				}
			}
			nPreguntasSinComments = nPreguntas - nPreguntasConComments;

			res.render('quizes/stats', {
						nPreguntas: nPreguntas, 
						nComments: nComments,
						nMedioComments: nMedioComments,
						nPreguntasSinComments: nPreguntasSinComments,
						nPreguntasConComments: nPreguntasConComments,
						errors: []
					});
		});
	});


};