//Construye la DB y el modelo.

var path = require('path');

var pg = require('pg');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6]||null);
var user 		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect 	= (url[1]||null);
var port 		= (url[5]||null);
var host 		= (url[4]||null);
var storage 	= process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd,
				{   dialect: protocol,
					protocol: protocol,
					port: port,
					host: host,
					storage: storage, //sólo SQLite (.env)
					omitNull: true //sólo Postgres
				});
//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Importar la definición de la tabla Comment en comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

//Definición de la relación 1 a N entre Quiz y Comment:
//cada quiz puede tener N comentarios
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exportar la definición de tabla Quiz
//se exporta para que la definición de la tabla Quiz pueda ser
//usada en quiz_controller.js
exports.Comment = Comment;

//Crear e inicializar tabla de preguntas en DB
sequelize.sync().then(function() {
	Quiz.count().then(function (count) {
		if (count === 0) { //inicializar tabla si estaba vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						});
			Quiz.create({ pregunta: 'Capital de Portugal',
						  respuesta: 'Lisboa'
						})
			.then(function(){console.log('BBDD inicializada')});
		};
	});
});