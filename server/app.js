var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var ejs = require('ejs');
var wesjtu = require('./routes/wesjtu');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/wesjtu', express.static(path.join(__dirname, 'public')));

app.use('/wesjtu', wesjtu);

app.set('port', process.env.PORT || 3001);
app.set('host', '127.0.0.1');
var server = http.createServer(app).listen(app.get('port'), app.get('host'), function() {
    console.log("Express server listening on port " + app.get('port')　 + " at host " + app.get('host'));
});

// error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message
    });
});


module.exports = app;
