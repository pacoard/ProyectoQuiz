var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

//Autoload: gestión de comandos con :quizId
router.param('quizId', quizController.load);

//Rutas nuevas, para la lista de preguntas
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

//Para crear preguntas
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);

//CAJETÍN DE BÚSQUEDA: GET  /quizes?search=texto_a_buscar
router.get('/quizes?busqueda=:busqueda(\\w)', quizController.index);

//Página del autor
router.get('/author', function(req, res) {
  res.render('author');
});

module.exports = router;
