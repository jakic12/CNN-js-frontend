const bodyParser = require(`body-parser`)
const express = require('express')
const cors = require('cors')
const sha256 = require(`sha256`)
const jwt = require(`jsonwebtoken`)
const {
    CNN,
    ActivationFunction,
    Layer,
    NetworkArchitectures
} = require(`./CNN-js/cnn`)
var app = express()

//app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())
app.use(cors())

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

const checkAuth = (req, res, next) => {
    let userId;
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        userId = jwt.verify(token, JWTsecret).userId
    } catch(error) {
        res.status(401).send('Unauthorized')
        return
    }

    req.userId = userId
    next()
}

app.post('/createCnn',checkAuth, (req, res) => {
    const neuralNet = new CNN(NetworkArchitectures.LeNet5)
    const net_id = new Date().getTime()
    
    if(neural_networks[req.userId])
        neural_networks[req.userId][net_id] = neuralNet
    else
        neural_networks[req.userId] = {[net_id]: neuralNet}
    res.send({ network_id: net_id})
})

app.get(`/getNetwork/:netId`, checkAuth, (req, res) => {
    if(neural_networks[req.userId])
        res.send(neural_networks[req.userId][req.params.netId])
    else
        res.send([])
})

app.get(`/getNetwork`, checkAuth, (req, res) => {
    if(neural_networks[req.userId])
        res.send(Object.keys(neural_networks[req.userId]))
    else
        res.send([])
})

app.post(`/login`, (req, res) => {
    if(req.body.user && req.body.pass){
        let hashPass = sha256(req.body.pass)
        let authUser = users.reduce((_, u) => u.user === req.body.user && u.pass === hashPass ? u : null)
        if(authUser)
            res.send({token: jwt.sign({ userId:authUser.userId }, JWTsecret, { expiresIn: `1 week` })})
        else
            res.send({err:`invalid username or password`})
    }else{
        console.log(req.body)
        res.send({err:`username and password required`})
    }
})

app.listen(3005, () => console.log('Server ready on 3005'))