var express = require('express');
var multer = require('multer');
var router = express.Router();

// Referencias a los controladores, para poder llamar a las funciones
// que exportan
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

//Autoload: gestión de comandos con identificadores de bases de datos
router.param('quizId', quizController.load);
router.param('commentId', commentController.load); //para :commentId
router.param('userId', userController.load);

//Rutas de sesión
router.get('/login', sessionController.new); //formulario
router.post('/login', sessionController.create); //crear sesión
router.get('/logout', sessionController.destroy); //salir de la sesión

//Rutas de las cuentas
router.get('/user', userController.new); //sign up
router.post('/user', userController.create);
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.destroy); 
router.get('/user/:userId(\\d+)/quizes', quizController.index); 

//Rutas para las preguntas
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired,
							multer({ dest: './public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired, quizController.ownershipRequired,  quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired,
									multer({ dest: './public/media/'}), quizController.destroy);

//CAJETÍN DE BÚSQUEDA: GET  /quizes?search=texto_a_buscar
router.get('/quizes?busqueda=:busqueda(\\w)', quizController.index);

//Para crear y ver comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
			 sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);
//Página del autor
router.get('/author', function(req, res) {
  res.render('author', {errors: []});
});

module.exports = router;
