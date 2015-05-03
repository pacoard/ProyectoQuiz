//Construye la DB y el modelo.

var path = require('path');

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
						{dialect: "sqlite", storage: "quiz.sqlite"}
					);
//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; //exportar la definición de tabla Quiz
//se exporta para que la definición de la tabla Quiz pueda ser
//usada en quiz_controller.js

//Crear e inicializar tabla de preguntas en DB
sequelize.sync().then(function() {
	//success handler
	Quiz.count().then(function (count) {
		if (count === 0) { //inicializar tabla si estaba vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						})
			.then(function(){console.log('BBDD inicializada')});
		};
	});
});