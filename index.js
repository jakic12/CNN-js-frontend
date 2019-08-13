const bodyParser = require(`body-parser`)
const express = require('express')
const app = express()
const sha256 = require(`sha256`)
const jwt = require(`jsonwebtoken`)

app.use(bodyParser.urlencoded({ extended:false }))

class User{
    constructor(username, password){
        this.user = username
        this.pass = sha256(password)
        this.userId = sha256(`${this.user}${password}${new Date()}`)
    }
}

var neural_networks = {}
var users = [
    new User(`jakob`, `test`)
]
var JWTsecret = `dosijpoiJUS{)D9uf09iu32-03-0}_)@($#}-03i9jg]f0-9i3)`

app.get('/createCnn', (req, res) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const userId = jwt.verify(token, JWTsecret).userId
        
        if(neural_networks[userId])
            neural_networks[userId][new Date()] = `test`
        else
            neural_networks[userId] = {[new Date()]: `test`}

    } catch(error) {
        res.status(401).send('Unauthorized')
    }
})

app.get(`/login`, (req, res) => {
    console.log(req.body.user)
    let hashPass = sha256(req.body.pass)
    let authUser = users.reduce((_, u) => u.user === req.body.user && u.pass === hashPass ? u : null)
    if(authUser)
        res.send({token: jwt.sign({ userId:authUser.userId }, JWTsecret, { expiresIn: `1 week` })})
    else
        res.send({err:`invalid username or password`})
})

app.listen(3005, () => console.log('Server ready'))