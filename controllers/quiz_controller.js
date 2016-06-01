
var models = require('../models');
var Sequelize = require('sequelize');

//load

exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId, {include: [ models.Comment]}).then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		}else{
			next(new Error ('No existe quizId=' + quizId));
		}
	}).catch(function(error){
		next(error);
	});
};


// GET /quizes

exports.index = function(req, res, next) {
   if((req.params.format === "JSON" || req.params.format === "json")){
	models.Quiz.findAll({order: 'question ASC',
		where: ["question like ?", '%'+req.query.search+'%']
	  }
	).then(function(quizes){
		res.json('quizes/index.ejs', {quizes: quizes});
	}).catch(function(error){
		next(error);
	});
   }else{
	models.Quiz.findAll({order: 'question ASC',
		where: ["question like ?", '%'+req.query.search+'%']
	  }
	).then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes});
	}).catch(function(error){
		next(error);
	});
   }
	
};

// GET /quizes/question

exports.show = function(req, res, next) {
  models.Quiz.findById(req.params.quizId).then(function(quiz){
	if(quiz){
	   if((req.params.format === "JSON" || req.params.format === "json")){
  	      var answer = req.query.answer || "";
  	      res.json('quizes/show', {quiz: req.quiz, answer: answer});
	   }else{
  	      var answer = req.query.answer || "";
  	      res.render('quizes/show', {quiz: req.quiz, answer: answer});
	   }
	}else{
	  throw new Error("No hay preguntas en las BBDD");}
	}).catch(function(error){
		next (error);
	});
};

// GET /quizes/check

exports.check = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz){
	if(quiz){
  	  var answer = req.query.answer || "";
  	  var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
	  res.render('quizes/result', {quiz: req.quiz, result: result, answer: answer});
	}else{
	  throw new Error("No hay preguntas en las BBDD");}
	}).catch(function(error){
		next (error);
	});
};
 
// GET /quizes/new

exports.new = function(req, res, next) {
	var quiz = models.Quiz.build({question: "", answer: ""});
	res.render('quizes/new', {quiz: quiz});
};

// GET /quizes/edit

exports.edit = function(req, res, next){
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz});
};

// GET /quizes/update

exports.update = function(req, res, next){
	req.quiz.question = req.body.quiz.question;
	req.quiz.answer = req.body.quiz.answer;

	req.quiz.save({fields: ["question", "answer"]}).then(function(quiz){
		req.flash('success', 'Quiz editado con éxito');
			res.redirect('/quizes');
	}).catch(Sequelize.ValidationError, function(error){
	req.flash('error', 'Errores en el formulario:');
	for(var i in error.errors){
		req.flash('error', error.errors[i].value);
	};
	res.render('quizes/edit', {quiz: req.quiz});
	}).catch(function(error){
	req.flash('error', 'Error al editar el Quiz: '+error.message); 
	next(error);
	});
};

// GET /quizes/destroy

exports.destroy = function(req, res, next) {
	req.quiz.destroy().then(function(){
		req.flash('success', 'Quiz borrado con éxito');
		res.redirect('/quizes');
	}).catch(function(error){
	req.flash('error', 'Error al borrar el Quiz: '+error.message); 
	next(error);
	});
};


// GET /quizes/create

exports.create = function(req, res, next) {
	var quiz = models.Quiz.build({question: req.body.quiz.question, answer: req.body.quiz.answer});

quiz.save({fields: ["question", "answer"]}).then(function(quiz){
	req.flash('success', 'Quiz creado con éxito');
	res.redirect('/quizes');
}).catch(Sequelize.ValidationError, function(error){
	req.flash('error', 'Errores en el formulario:');
	for(var i in error.errors){
		req.flash('error', error.errors[i].value);
	};
	res.render('quizes/new', {quiz: quiz});
}).catch(function(error){
	req.flash('error', 'Error al crear un Quiz: '+error.message); 
	next(error);
});
};

