const MongoClient = require('mongodb').MongoClient;
const hbs = require('hbs');
const express = require('express');
const bodyParser = require('body-parser');
const maper = require('./pacman_read_file')
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");

var app = express();

const db_code = "mongodb+srv://client:passwerd1@cluster0-4kbn7.mongodb.net/test?retryWrites=true"
const port = process.env.PORT || 8080;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('views')); 

app.set('view engine', 'hbs');

app.post('/login', (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    MongoClient.connect(db_code, {useNewUrlParser: true}, (err, client) => {
        if (err) {
            console.error('Error occured: ', err);
        } else {
            var database = client.db("PAC-MAN")
            database.collection("Users").find({
                username: username
            }).toArray((err, result) => {
                if (err || result[0] == undefined) {
                        response.render('home.hbs',{
                            errortext: "Invalid username/password."
                        });
                } else {
                    if (
                        bcrypt.compareSync(password, result[0].password)
                    ) {
                        response.cookie("username", [
                            username,
                            result[0].highscore
                        ]);
                        response.redirect("/pacman");
                    } else {
                        response.render("home.hbs", {
                            errortext: "Invalid username/password."
                        });
                    }
                }
            });
        }
    })
})

app.get('/register', (request, response) => {
    response.render('register.hbs', {  
        errortext: ""
    });
})

app.post('/register', (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    if (username.includes("<") || password.includes("<") || username.length > 12) {
        response.redirect('/register')
    } else {
        MongoClient.connect(db_code, {useNewUrlParser: true}, (err, client) => {
            if (err) {
                console.error('Error occured: ', err);
            } else {
                var database = client.db("PAC-MAN")
                database.collection("Users").findOne({
                    username: username,
                }).then (function (doc) {
                    if (doc !== null) {
                        response.render('register.hbs', {
                            errortext: "User already exists."
                        })
                    } else {
                        database.collection("Users").insertOne({
                            username: username,
                            password: bcrypt.hashSync(password, 10),
                            highscore: 0
                        }) 
                        response.redirect('/');
                    }
                })
            }
        })
    }
})

app.get('/', (request, response) => {
    response.clearCookie("username")
    response.render('home.hbs', {
        errortext: ""
    });
})

app.post('/submit', (request, response) => {
    var username = request.body.username;
    var score = parseInt(request.body.score, 10);
    MongoClient.connect(db_code, {useNewUrlParser: true}, (err, client) => {
        if (err) {
            console.error('Error occured: ', err);
        } else {
            var database = client.db("PAC-MAN")
            database.collection("Users").findOne({
                username: username,
            }).then (function (doc) {
                if (doc == null) {
                    response.render('home.hbs', {
                        errortext: "Failed to compare scores."
                    })
                } else if (doc.highscore > score) {
                    response.redirect('/pacman')
                } else {
                    database.collection("Users").updateOne({
                        username: username
                    }, {
                        $set: {"highscore": score}
                    }) 
                    response.cookie('username', [username, score])
                    response.redirect('/pacman')
                }
            })
        }
    })
})

app.get('/pacman', (request, response) => {
    if (request.cookies.username == undefined) {
        response.redirect('/')
    } else {
        MongoClient.connect(db_code, {useNewUrlParser: true}, (err, client) => {
            if (err) {
                console.error('Error occured: ', err);
            } else {
                var database = client.db("PAC-MAN")
                database.collection("Users").find({}).sort({highscore:-1}).limit(10).toArray(function (err, result) {
                    highscores = result.map(user => ({username: user.username, highscore: user.highscore}))
                    highscores = highscores.map(function(highscore) {
                        stringscore = highscore['highscore'].toString()
                        spaces = 29 - (highscore['username'].length + stringscore.length)
                        return highscore['username'] + " ".repeat(spaces) + highscore['highscore']
                    })
                    highscores = highscores.join("\n")
                    response.render('pacman.hbs',{
                        values:maper.map(),
                        width: 28,
                        highscores: highscores,
                        username: request.cookies.username[0],
                        highscore: request.cookies.username[1]
                    });
                })
            }
        })
    }
})

app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});


