var express = require('express');
var app = express();

var mysql = require('./dbcon.js');

// Configure Handlebars
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Configure body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.set('port', process.argv[2] || 3000);

app.get('/reset-table', function(req, res, next) {
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err) {
    var createString = "CREATE TABLE workouts(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "reps INT," +
      "weight INT," +
      "date DATE," +
      "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err) {
      context.results = "Table reset";
      res.render('index', context);
    })
  });
});

app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function() {
  console.log('Server started on http://localhost:' + app.get('port') + '.');
});
