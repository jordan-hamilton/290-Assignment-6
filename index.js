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

// Set the public folder as a static directory
app.use(express.static('public'));

app.set('port', process.argv[2] || 3000);

app.get('/', function(req, res, next) {
  var context = {};
  context.data = [];

  mysql.pool.query('SELECT * FROM workouts', function(error, rows, fields) {
    if (error) {
      next(error);
      return;
    }

    var content = rows;
    console.log(content);
    for (var item in content) {
      context.data.push({
        'id': content[item].id,
        'name': content[item].name,
        'reps': content[item].reps,
        'weight': content[item].weight,
        'date': content[item].date,
        'lbs': content[item].lbs,
      });
    }
    console.log(context);
    res.render('index', context);
  });
});

app.post('/', function(req, res, next) {
  var context = {};

  if (req.body.name) {
    var workout = {
      name: req.body.name,
      reps: req.body.reps,
      weight: req.body.weight,
      date: req.body.date,
      lbs: req.body.lbs
    };
    mysql.pool.query("INSERT INTO workouts SET ?", workout, function(error, results, fields) {
      if (error) {
        next(error);
        return;
      }
      console.log(`Inserted id ${results.insertId}`); //DEBUG
    });
  } else {
    console.log('Not enough info provided to process this workout');
  }
});

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
