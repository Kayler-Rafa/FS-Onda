var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.token == null){
    res.render('pages/index', { title: 'não logado' });
  } else {
    res.render('layout', { body: 'pages/index', title: 'Express' });
  }
});

module.exports = router;
