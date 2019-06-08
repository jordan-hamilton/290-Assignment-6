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

    for (var item in rows) {
      context.data.push({
        'id': rows[item].id,
        'name': rows[item].name,
        'reps': rows[item].reps,
        'weight': rows[item].weight,
        'date': rows[item].date,
        'lbs': rows[item].lbs,
      });
    }
    res.render('index', context);
  });
});

app.post('/', function(req, res, next) {

  if (req.body.delete) {
    handleDelete();
  } else if (req.body.update) {
    handleUpdate();
  } else if (req.body.add) {
    handleNew();
  } else {
    res.status(400);
    res.send('Could not process this request');
  }

  function handleDelete() {
    mysql.pool.query("DELETE FROM workouts WHERE id=?", req.body.id, function(error, results) {
      if (error) {
        next(error);
        return;
      }
      res.status(200);
      res.send('Workout deleted successfully');
    });
  }

  function handleUpdate() {
    var context = {};
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", req.body.id, function(error, results) {
      if (error) {
        next(error);
        return;
      }
      if (results.length == 1) {
        var workout = results[0];
        mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
          [req.body.name || workout.name,
            req.body.reps || workout.reps,
            req.body.weight || workout.weight,
            req.body.date || workout.date,
            req.body.lbs || workout.lbs,
            req.body.id
          ],
          function(error, result) {
            if (error) {
              next(error);
              return;
            }
            context.results = "Updated " + result.changedRows + " rows.";
            res.render('index', context);
          });
      }
    });
  }

  function handleNew() {
    var context = {};
    var workout = {
      name: req.body.name,
      reps: req.body.reps,
      weight: req.body.weight,
      date: req.body.date,
      lbs: req.body.lbs
    };
    mysql.pool.query("INSERT INTO workouts SET ?", workout, function(error, results) {
      if (error) {
        next(error);
        return;
      }
      mysql.pool.query("SELECT * FROM workouts WHERE id=?", results.insertId, function(error, results) {
        if (error) {
          next(error);
          return;
        }
        if (results.length == 1) {
          res.status(201);
          res.send(results[0]);
        }
      });
    });
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
      res.render('reset', context);
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
