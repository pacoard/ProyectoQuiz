
var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta "Quiz"

//Quiz 10: Autoload. Factoriza el código si la ruta incluye :quizId
exports.load = function(req,res,next,quizId) {
	models.Quiz.find({
			where: { id: Number(quizId) },
			include: [{ model: models.Comment }]
		}).then(function(quiz) {
			if (quiz) {req.quiz = quiz; next();}
			else next(new Error('No existe el quiz con ID='+quizId));
		}).catch(function(error) { next(error);});
};

//Get /quizes
/*exports.index = function(req,res) {
	if (req.query.busqueda != null) {
		var search = '%'+req.query.busqueda+'%'; //para buscar palabras intermedias
		models.Quiz.findAll({where: ["pregunta like ?", search]})
		.then(function (quizes) {
			//ordenar alfabéticamente
			var i, aux;
			for (i=1; i<quizes.length; i++) {
				if (quizes[i].pregunta < quizes[i-1].pregunta) {
					aux = quizes[i-1];
					quizes[i-1]=quizes[i];
					quizes[i]=aux;
				}
			}
			//mostrar lista
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error)});
	}
	else {
		models.Quiz.findAll().then(function (quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error)});
	}
};*/
exports.index = function(req,res) {
	if (req.query.busqueda != null) {
		var search = '%'+req.query.busqueda+'%'; //para buscar palabras intermedias
		models.Quiz.findAll({where: ["pregunta like ?", search]})
		.then(function (quizes) {
			//ordenar alfabéticamente
			var i, aux;
			for (i=1; i<quizes.length; i++) {
				if (quizes[i].pregunta < quizes[i-1].pregunta) {
					aux = quizes[i-1];
					quizes[i-1]=quizes[i];
					quizes[i]=aux;
				}
			}
			//mostrar lista
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error)});
	}
	else {
		models.Quiz.findAll().then(function (quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error)});
	}
};
//Get /quizes/:id
exports.show = function(req,res) { //para la lista de preguntas
	res.render('quizes/show', { quiz: req.quiz, errors: []} );
};

exports.answer = function(req,res) {
	if (req.query.respuesta === req.quiz.respuesta)
		res.render('quizes/answer', {respuesta: 'Correcto', quizId: req.quiz.id, errors: []});
		
	else res.render('quizes/answer', {respuesta: 'Incorrecto', quizId: req.quiz.id, errors: []});
};

//Get /quizes/new -----para crear preguntas
exports.new = function(req,res) {
	//Se crea e inicializa una fila en la base de datos
	var  quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

//Post /quizes/create
exports.create = function(req,res) {
	//Se crea e inicializa una fila en la base de datos
	req.body.quiz.UserId = req.session.user.id;
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) {
		if (err) res.render('quizes/new', {quiz: quiz, errors: err.errors});
		else {
			//Guardar en la BBDD pregunta y respuesta del quiz
			quiz.save({fields: ["pregunta", "respuesta", "UserId"]})
			.then(function() {
				res.redirect('/quizes')}) //redirige a la lista de preguntas
		}
	}).catch(function(error) {next(error)});	
};

exports.edit = function(req,res) {
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []})
};

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz.validate().then(function(err) {
		if (err)
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		else {
			req.quiz // save: guarda campos pregunta y respuesta en DB
			.save( {fields: ["pregunta", "respuesta"]})
			.then( function(){ res.redirect('/quizes');});
		} // Redirección HTTP a lista de preguntas (URL relativo)
	}).catch(function(error){next(error)});
};

exports.destroy = function(req,res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};