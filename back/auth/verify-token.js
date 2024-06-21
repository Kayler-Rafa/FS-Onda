var jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).send({ error: 'Token não encontrado' })
    } else {
        jwt.verify(token, '8c10472423dc7ac1b8fdb91c96793ae8d385da1af1a334950f9f22dbef19edad', (err, user) => {
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
