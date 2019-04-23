const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;
const hbs = require("hbs");

const POSTS_COLLECTION = "posts";
const USERS_COLLECTION = "users";

const app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

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
//console.log("Database connection ready");

// Initialize the app
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port ", port);
});
});

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static('public'))

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('message', (text) => {
    return text.toUpperCase();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.statuse(code || 500).json({"error": message});
};

app.get('/post', function(request, response) {
    response.render('post.hbs', {
        title: 'New Post',
        welcome: 'Contribute to the one sided conversations',
        year: new Date().getFullYear()
    });
});

app.get('/delete', function (request, response) {
    response.render('delete.hbs', {
        title: 'Delete Post',
        welcome: 'DESTROY POSTS! (as long as you have the password...)',
        year: new Date().getFullYear()
    });
});

app.post('/post/submit', function (request, response) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var date = new Date()
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var date = day + ' ' + monthNames[monthIndex] + ' ' + year;

    var postid = Math.floor(Math.random() * 90000000) + 10000000;
    var username = request.body.username;
    var content = request.body.content;
    db.collection('posts').insertOne({
        postid: postid,
        datetime: date,
        username: username,
        content: content
    }, (err, result) => {
        if (err) {
            response.send('Unable to create post');
        }
        var cursor = db.collection('posts').find().toArray((err, result) => {
            if (err) {
                response.send('Unable to get posts');
            }
            var content = [];
            var count = Object.keys(result).length;
            for (i = 0; i < count; i++) {
                content[i] = ['Post ' + JSON.stringify(result[i].postid) +
                    ' - Posted by ' + JSON.stringify(result[i].username) +
                    ' on ' + JSON.stringify(result[i].datetime) + '<br>' +
                    '&nbsp;&nbsp; Message: ' + JSON.stringify(result[i].content)
                ];
            };
            var content = content.join('<br> <br>');
            //console.log(content)
            response.render('board.hbs', {
                title: 'Board',
                year: new Date().getFullYear(),
                welcome: 'Post something cool, nerd',
                content: content
            });
        });
    });
});

app.post('/post/delete', function(request, response) {
    var postid = parseInt(request.body.postid);
    var passwd = request.body.passwd;
    if (passwd == "admin") {
        //begin deletion loop (might add more deletion methods in the future)
        //remove by ID
            db.collection('posts').remove({
                postid: {
                    $eq: postid
                }
            }, (err, result) => {
                if (err) {
                    response.send('Unable to delete post');
                }
                response.render('delete.hbs', {
                    title: 'DESTROY POST',
                    year: new Date().getFullYear(),
                    welcome: "Post deleted"
                });
            });
    // end deletion loop
    } else {
        response.render('badpass.hbs', {
            title: 'Bad Password',
            welcome: "Try again",
            year: new Date().getFullYear()
        });
    }
});

app.get('/', function(request, response) {
    var cursor = db.collection('posts').find().toArray((err, result) => {
        if (err) {
            response.send('Unable to get posts');
        }
        var content = [];
        var count = Object.keys(result).length;
        for (i=0; i<count; i++) {
            content[i] = ['Post ' + JSON.stringify(result[i].postid) +  
            ' - Posted by ' + JSON.stringify(result[i].username) + 
            ' on ' + JSON.stringify(result[i].datetime) + '<br>' +
            '&nbsp;&nbsp; Message: ' + JSON.stringify(result[i].content)
            ];
        };
        var content = content.join('<br> <br>');
        //console.log(content)
        response.render('board.hbs', {
            title: 'Board',
            year: new Date().getFullYear(),
            welcome: 'Post something cool, nerd',
            content: content
        });
        
    });
});
