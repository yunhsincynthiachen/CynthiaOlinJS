var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var ReactDOM = require('react-dom')
var app = express();

var COMMENTS_FILE = path.join(__dirname, 'comments.json');

var index = require('./routes/index');


app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//ROUTES: getting, posting, editing, completing todos
app.get('/api/todos', index.getactivetodos);

app.post('/api/todos', index.posttodo);

app.post('/api/todos/:id_todo', index.edittodo);

app.post('/api/todos/completed/:id_todo', index.deletetodo);

app.get('/api/todos/completed',index.getcompletedtodos);

app.get('/api/todos/all',index.getalltodos);


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
