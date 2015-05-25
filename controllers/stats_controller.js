
var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta todas las tablas de la BBDD
// Se importa de models.js: Quiz, Comment y User

//Cálculo de las estadísticas
exports.cargar = function(req,res) {
	
	models.Quiz.findAll().then(function (quizes){
		models.Comment.findAll().then(function (comments) {
			var nPreguntas = quizes.length, 
				nComments = comments.length, 
				nMedioComments = nComments/nPreguntas, 
				nPreguntasSinComments = 0, 
				nPreguntasConComments = 0;

			//Cálculo del número de preguntas con comentarios
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