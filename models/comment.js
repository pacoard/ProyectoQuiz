//Modelo de comment con validación
module.exports = function(sequelize, DataTypes) {
	//Crea la BBDD de los comentarios y la exporta
	return sequelize.define(
		'Comment',
			{ texto: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta comentario"}}
			},
			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}
	);
}