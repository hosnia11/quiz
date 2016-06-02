var express = require('express');
var router = express.Router();

var quizController = require ('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.param('quizId', quizController.load);
router.param('userId', userController.load); 

router.get('/quizes.:format?', quizController.index);
router.get('/quizes/:quizId(\\d+).:format?', quizController.show);
router.get('/quizes/:quizId(\\d+)/check', quizController.check);
router.get('/quizes/new', quizController.new);
router.post('/quizes', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

router.get('/users', userController.index);   
router.get('/users/:userId(\\d+)', userController.show);   
router.get('/users/new', userController.new);    
router.post('/users', userController.create);  
router.get('/users/:userId(\\d+)/edit', userController.edit);     
router.put('/users/:userId(\\d+)', userController.update);   
router.delete('/users/:userId(\\d+)', userController.destroy);

router.get('/session',    sessionController.new);  
router.post('/session',   sessionController.create); 
router.delete('/session', sessionController.destroy);

/* GET author*/
router.get('/author', function(req, res, next) {
  res.render('author');
});

module.exports = router;
