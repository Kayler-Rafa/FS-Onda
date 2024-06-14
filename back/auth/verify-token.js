var jwt = require('jsonwebtoken');

  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).send({ error: 'Token não encontrado' })
    } else {
        jwt.verify(token, '408e0135f57bebc614c26b4f6afda7637efd027a7d0c26f6ab6904ddf69741d5', (err, user) => {
            if (err){
                return res.status(403).send({ error: 'Token inválido' })
            }else{
                req.user = user
                next()
            }
        })
    }
}

module.exports = authenticateToken;