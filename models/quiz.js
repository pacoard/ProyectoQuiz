//Patrón MVC: Modelo de Quiz
module.exports = function(sequelize, DataTypes) {
	//Crea la BBDD y la exporta
	return sequelize.define('Quiz',
			{ pregunta: DataTypes.STRING,
			  respuesta: DataTypes.STRING,
			});
}