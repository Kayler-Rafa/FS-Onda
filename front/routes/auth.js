var express = require('express');
var router = express.Router();

/* URL do back-end */
const loginUrl = "https://automatic-halibut-w4p9xrj9wr4hgvxq-4000.app.github.dev/auth/login";

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('layout', { body: 'pages/login', title: 'Express', error: '' });
});

router.post('/', (req, res) => {
    const { username, password } = req.body;
    console.log('Login do Front', req.body);
    fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(async (res) => {
            if (!res.ok) {
                const err = await res.json();
                throw err;
            }
            return res.json();
        })
        .then((data) => {
            console.log('veio', data);
            req.session.token = data.token;
            res.redirect('/pets');
        })
        .catch((error) => {
            console.log("erro aqui>", error);
            res.render('layout', { body: 'pages/login', title: 'Express', error });
        });
});

/* Adicione a rota de logout */
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/');
    });
});

module.exports = router;
