//Patrón MVC: Modelo de Quiz
module.exports = function(sequelize, DataTypes) {
	//Crea la BBDD y la exporta
	return sequelize.define(
		'Quiz',
			{ pregunta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta pregunta"}}
			},
			  respuesta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta respuesta"}}
			},
			  image: {
			  	type: DataTypes.STRING
			 }
		}
	);
}