const MongoClient = require('mongodb').MongoClient;
const hbs = require('hbs');
const express = require('express');
const bodyParser = require('body-parser');
const maper = require('./pacman_read_file')
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const mongodb = require("mongodb");
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var sioport = process.env.PORT || 3000;

// Create a database variable outside of the database connection callback to reuse the connection pool
var db;

// Connect to the database before starting the application server
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/forum", function (err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save databse object from the callback for reuse
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app
    var server = http.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port ", port);
    });
});

// Register partials
hbs.registerPartials(__dirname + '/views/partials');

// Parser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// collection names for later user
const POSTS_COLLECTION = "posts";
const USERS_COLLECTION = "Users";

// Register views directory
app.use(express.static('views')); 

// Register styles directory
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static('public'))

// Helpers
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('message', (text) => {
    return text.toUpperCase();
});

app.post('/login', (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
            db.collection(USERS_COLLECTION).find({
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
})

app.get('/register', (request, response) => {
    response.render('register.hbs', {  
        errortext: ""
    });
})

app.get('/reset', (request, response) => {
    db.dropDatabase();
    db.collection(USERS_COLLECTION).insertOne({
        username: "Death",
        password: bcrypt.hashSync("Death", 10),
        highscore: 0
    });
    db.collection(USERS_COLLECTION).insertOne({
        username: "Turns",
        password: bcrypt.hashSync("Turns", 10),
        highscore: 0
    });
    db.collection(USERS_COLLECTION).insertOne({
        username: "Seconds",
        password: bcrypt.hashSync("Seconds", 10),
        highscore: 0
    });
    db.collection(USERS_COLLECTION).insertOne({
        username: "Pallets",
        password: bcrypt.hashSync("Pallets", 10),
        highscore: 0
    });
    response.redirect('/')
})
app.post('/register', (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    if (username.includes("<") || password.includes("<") || username.length > 12) {
        response.redirect('/register')
    } else {
        db.collection(USERS_COLLECTION).findOne({
            username: username,
        }).then (function (doc) {
            if (doc !== null) {
                response.render('register.hbs', {
                    errortext: "User already exists."
                })
            } else {
                db.collection(USERS_COLLECTION).insertOne({
                    username: username,
                    password: bcrypt.hashSync(password, 10),
                    highscore: 0
                }) 
                response.redirect('/');
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
    var second = parseInt(request.body.seconds,10); // This is the second count
    var corner = parseInt(request.body.corner,10); //This is the corner count
    var score = parseInt(request.body.score, 10);
    db.collection(USERS_COLLECTION).findOne({
            username: username,
    }).then (function (doc) {
            if (doc == null) {
                response.render('home.hbs', {
                    errortext: "Failed to compare scores."
                })
            } else if (doc.highscore > score) {
                response.redirect('/pacman')
            } else {
                db.collection(USERS_COLLECTION).updateOne({
                    username: username
                }, {
                    $set: {"highscore": score}
            }) 
            response.cookie('username', [username, score])
            response.redirect('/pacman')
        }
    })
    var num = 0;
    db.collection(USERS_COLLECTION).findOne({
        username: "Death",
    }).then (function (doc) {
        num = doc.highscore + 1
        console.log(num);
        db.collection(USERS_COLLECTION).updateOne({
            username: "Death"
            }, {
                $set: {"highscore": num}
            }) 
    })
    db.collection(USERS_COLLECTION).findOne({
        username: "Seconds",
    }).then (function (doc) {
        num = doc.highscore + second
        console.log(num);
        db.collection(USERS_COLLECTION).updateOne({
            username: "Seconds"
            }, {
                $set: {"highscore": num}
            }) 
    })
    db.collection(USERS_COLLECTION).findOne({
        username: "Turns",
    }).then (function (doc) {
        num = doc.highscore + corner
        db.collection(USERS_COLLECTION).updateOne({
            username: "Turns"
            }, {
                $set: {"highscore": num}
            }) 
    })
    db.collection(USERS_COLLECTION).findOne({
        username: "Pallets",
    }).then (function (doc) {
        num = doc.highscore + score/100
        db.collection(USERS_COLLECTION).updateOne({
            username: "Pallets"
            }, {
                $set: {"highscore": num}
            }) 
    })
})

app.get('/pacman', (request, response) => {
    if (request.cookies.username == undefined) {
        response.redirect('/')
    } else {
        db.collection(USERS_COLLECTION).find({}).sort({highscore:-1}).limit(10).toArray(function (err, result) {
            highscores = result.map(user => ({username: user.username, highscore: user.highscore}))
            console.log(highscores)
            var len = Object.keys(highscores).length
            for (i = 0; i < len; i++) {
                console.log('loop in')
                if (highscores[i].username == "Death"){
                    deaths = highscores[i].highscore;
                    console.log(highscores[i]);
                    delete highscores[i];
                } else if (highscores[i].username == "Seconds") {
                    seconds = highscores[i].highscore;
                    console.log(highscores[i]);
                    delete highscores[i];
                } else if (highscores[i].username == "Turns") {
                    turns = highscores[i].highscore;
                    console.log(highscores[i]);
                    delete highscores[i];
                } else if (highscores[i].username == "Pallets") {
                    pellets = highscores[i].highscore;
                    console.log(highscores[i]);
                    delete highscores[i];
                }
            }
            highscores = highscores.map(function(highscore) {
                stringscore = highscore['highscore'].toString()
                spaces = 29 - (highscore['username'].length + stringscore.length)
                return highscore['username'] + " ".repeat(spaces) + highscore['highscore']
            })
            highscores = highscores.join("\n");
            response.render('pacman.hbs', {
                values: maper.map(),
                width: 28,
                highscores: highscores,
                deaths: deaths,
                seconds: seconds,
                turns: turns,
                pellets: pellets,
                username: request.cookies.username[0],
                highscore: request.cookies.username[1]
            });
        });
    }
})

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});



