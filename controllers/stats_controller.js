
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
			for (var i=0; i<nPreguntas; i++) {
				for (var j=0; j<nComments; j++) {
					if (comments[j].QuizId === quizes[i].id) {
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


exports.ranking = function(req,res, next) {
	models.User.findAll().then(function (users) {
		//ordenar por puntuación
		var done = false;
		var aux;
    	while (!done) {
	        done = true;
	        for (var i = 1; i<users.length; i++) {
	            if (users[i-1].puntos < users[i].puntos) {
	                done = false;
	                aux = users[i-1];
					users[i-1]=users[i];
					users[i]=aux;
	            }
	        }
   	 	}

		res.render('user/ranking', {users: users, errors: []});
	}).catch(function(error){next(error)});
};