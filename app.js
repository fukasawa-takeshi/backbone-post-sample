
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.post('/getuser', function(req, res){
  console.log('team', req.body.team);
  res.set('Content-Type', 'text/xml');
  var xml = "<users>\n" 
    + "\t<user><name>れに</name><team>推され隊</team></user>\n"
    + "\t<user><name>かなこぉ↑↑</name><team>ももたまい</team></user>\n"
    + "\t<user><name>しおり</name><team>ももたまい</team></user>\n"
    + "\t<user><name>あやか</name><team>あーりん</team></user>\n"
    + "\t<user><name>ももか</name><team>推され隊</team></user>\n"
    + "</users>";
  res.send(xml);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
