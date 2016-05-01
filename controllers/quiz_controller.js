
// GET /quizes/question

exports.question = function(req, res) {
  res.render('quizes/question', {pregunta: '¿Cual es la capital de Italia?'});
};

// GET /quizes/answer

exports.answer = function(req, res) {
  if (req.query.respuesta === 'Roma'){
      res.render('quizes/answer', {respuesta: 'Correcta'});
  } else {
      res.render('quizes/answer', {respuesta: 'Incorrecta'});
  }
};
