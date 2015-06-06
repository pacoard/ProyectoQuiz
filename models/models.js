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

//Importar la definición de la tabla User en user.js
var User = sequelize.import(path.join(__dirname, 'user'))

//---------------------------------------------------------
//Cada User tendrá N Quizes, y cada Quiz tendrá N Comments
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);
Quiz.belongsTo(User);
User.hasMany(Quiz);
//---------------------------------------------------------

//---------------------------------------------------------
//Relaciones para los favoritos
User.belongsToMany(Quiz, { through: "Favs", as: "Favs" });
Quiz.belongsToMany(User, { through: "Favs", as: "Favs" });


exports.Quiz = Quiz; //exportar la definición de tabla Quiz
//se exporta para que la definición de la tabla Quiz pueda ser
//usada en quiz_controller.js
exports.Comment = Comment;

exports.User = User;

//Crear e inicializar la BBDD
sequelize.sync().then(function() {
	User.count().then(function (count){
		if(count === 0) { 
			User.bulkCreate(
				[ {username: 'admin', password: '1234', isAdmin: true},
				  {username: 'paco', password: '5678'}, // isAdmin = false por defecto
				  {username: 'user1', password: 'user1'},
				  {username: 'user2', password: 'user2'},
				  {username: 'user3', password: 'user3'},
				  {username: 'user4', password: 'user4'},
				  {username: 'user5', password: 'user5'},
				  //valores de puntuación: todos a cero por defecto
				]).then(function(){
					console.log('BBDD inicializada');
					Quiz.count().then(function (count){
						if(count === 0) {
							Quiz.bulkCreate(
								[ {pregunta: '¿Contraseña del admin?', respuesta: '1234', UserId: 1, image: 'admin.jpeg'},
								  {pregunta: '¿Capital de Italia?', respuesta: 'Roma', UserId: 2, image: 'roma.jpeg'}, // pertenecerán al usuario 2 (paco)
								  {pregunta: '¿Capital de Portugal?', respuesta: 'Lisboa', UserId: 2, image: 'portugal.png'},
								  {pregunta: '¿Capital de Burkina Faso?', respuesta: 'Uagadugú', UserId: 2, image: 'burkinafaso.png'}
								]).then(function(){
									console.log('BBDD inicializada')});
						};
					});
				});
		};
	});
});