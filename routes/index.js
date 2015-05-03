var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//Rutas nuevas, para la lista de preguntas
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

//Comentadas estas rutas para sustituirlas por la lista de preguntas
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);

//Página del autor
router.get('/author', function(req, res) {
  res.render('author'); //, { title: 'Quiz' });
});

module.exports = router;
