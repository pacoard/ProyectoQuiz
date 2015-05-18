
var models = require('../models/models.js'); //para acceder a la BBDD,
//ya que el módulo models.js exporta "Quiz"

//Quiz 22: autorización para editar quiz (si éste pertenece al usuario, o si el usuario es admin)
exports.ownershipRequired =  function(req,res,next) {
	var objQuizOwner = req.quiz.UserId; //id de usuario propietario del quiz
	var logUser = req.session.user.id; //id de usuario que intenta editar el quiz
	var isAdmin = req.session.user.isAdmin; //booleano para ver si el usuario es el admin

	if (isAdmin || objQuizOwner === logUser)
		next();
	else
		res.redirect('/');
};

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

//Get /quizes y /users/:userId/quizes
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
		var options = {};
		if (req.user) options.where = {UserId: req.user.id};

		models.Quiz.findAll(options).then(function (quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
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
	
	if(req.files.image)
		req.body.quiz.image = req.files.image.name;

	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) {
		if (err) res.render('quizes/new', {quiz: quiz, errors: err.errors});
		else {
			//Guardar en la BBDD pregunta y respuesta del quiz
			quiz.save({fields: ["pregunta", "respuesta", "UserId", "image"]})
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
	if(req.files.image)
		req.body.quiz.image = req.files.image.name;

	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz.validate().then(function(err) {
		if (err)
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		else {
			req.quiz // save: guarda campos pregunta y respuesta en DB
			.save( {fields: ["pregunta", "respuesta", "imagesu"]})
			.then( function(){ res.redirect('/quizes');});
		} // Redirección HTTP a lista de preguntas (URL relativo)
	}).catch(function(error){next(error)});
};

exports.destroy = function(req,res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};