/*Because the interactions should be handled via Ajax, you often only want the
database to send back an updated version of the table, not a whole new page.
If you go back to the very first example with Express.js in week 7, you will see
an example where we return plain text rather than HTML in a fancy Handlebars
template. You can use this same technique to return a simple JSON string (which
conveniently is what is shown being displayed in the MySQL demos). Just send
that back to the browser in response to an Ajax request and build a table using
it rather than generating the HTML on the server.

You could even do this when you make the page initially.
Just have JavaScript make an Ajax request when the page
is loaded to get the JSON representing the table. You never
even need to build a table on the server that way.*/

document.addEventListener('DOMContentLoaded', function(event) {
  bindButtons();
});

function bindButtons() {
  var deleteButtons = document.getElementsByClassName('workoutDelete');
  for (var i = 0; i < deleteButtons.length; i++) {
    bindDelete(deleteButtons[i], deleteButtons[i].parentNode.lastElementChild.value);
  }

  var updateButtons = document.getElementsByClassName('workoutUpdate');
  for (var i = 0; i < deleteButtons.length; i++) {
    bindUpdate(updateButtons[i], updateButtons[i].parentNode.lastElementChild.value);
  }

  bindAdd(document.getElementById('workoutSubmit'));
}

function bindDelete(button, workoutId) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var request = new XMLHttpRequest();
    var payload = {
      delete: true,
      id: workoutId
    };
    var row = button.parentNode.parentNode.parentNode;
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function() {
      if (request.status >= 200 && request.status < 400) {
        console.log(request.responseText);
        // Remove from the interface if successfully removed from the database
        deleteRow('workouts', row);
      } else {
        console.error(`An error occurred: ${request.statusText}`);
      }
    });
    request.send(JSON.stringify(payload));
  });
}

function deleteRow(tableId, row) {
  var table = document.getElementById(tableId);
  table.deleteRow(row.rowIndex);
}

function bindUpdate(button, workoutId) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var request = new XMLHttpRequest();
    var payload = {
      update: true,
      id: workoutId
    };
    payload.id = workoutId;
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function() {
      if (request.status >= 200 && request.status < 400) {
        console.log(request.responseText);
      } else {
        console.error(`An error occurred: ${request.statusText}`);
      }
    });
    request.send(JSON.stringify(payload));
  });
}

function bindAdd(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var request = new XMLHttpRequest();

    var form = document.getElementById('workoutForm');
    var payload = {
      add: true,
      name: form.elements[0].value,
      reps: form.elements[1].value,
      weight: form.elements[2].value,
      lbs: form.elements[3].value,
      date: form.elements[4].value
    };
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function() {
      if (request.status >= 200 && request.status < 400) {
        console.log(request.responseText);
        addRow('workouts', JSON.parse(request.responseText));
      } else {
        console.error(`An error occurred: ${request.statusText}`);
      }
    });
    request.send(JSON.stringify(payload));
  });
}

function addRow(tableId, content) {
  var table = document.getElementById(tableId);
  var newRow = table.insertRow(-1);

  var nameCell = newRow.insertCell(0);
  nameCell.textContent = content.name;

  var repsCell = newRow.insertCell(1);
  repsCell.textContent = content.reps;

  var weightCell = newRow.insertCell(2);
  weightCell.textContent = content.weight;
  if (content.lbs) {
    weightCell.textContent += ' lbs';
  } else weightCell.textContent += ' kg';

  var dateCell = newRow.insertCell(3);
  dateCell.textContent = content.date;
  console.log(typeof(content.date));
}

/*function logRow(event, tableID, currentRow) {
  event.preventDefault();
  try {
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    console.log(currentRow);
    for (var i = 0; i < rowCount; i++) {
        var row = table.rows[i];

        if (row == currentRow.parentNode.parentNode) {
            if (rowCount <= 1) {
                alert("Cannot delete all the rows.");
                break;
            }
            table.deleteRow(i);
            rowCount--;
            i--;
        }
    }
  } catch (e) {
    alert(e);
  }
}*/


/*document.getElementById('weatherSubmit').addEventListener('click', function(event) {
  event.preventDefault();
  var request = new XMLHttpRequest();
  var location = document.getElementById('location').value;
  request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + location + ',us&units=imperial&appid=' + apiKey, true);
  request.addEventListener('load', function() {
    if (request.status >= 200 && request.status < 400) {
      var response = JSON.parse(request.responseText);
      document.getElementById('weatherData').textContent = 'Current Temperature: ' + response.main.temp + ' °F';
      console.log(response);
    } else {
      console.log(`An error occurred: ${request.statusText}`)
    }
  });
  request.send(null);
});*/

/*document.getElementById('postSubmit').addEventListener('click', function(event) {
  event.preventDefault();
  var request = new XMLHttpRequest();
  var payload = {firstName:null};
  payload.firstName = document.getElementById('firstName').value;
  request.open('POST', 'https://httpbin.org/post', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.addEventListener('load', function() {
    if (request.status >= 200 && request.status < 400) {
      var response = JSON.parse(request.responseText);
      document.getElementById('postData').textContent = 'Response: ' + response.data;
      console.log(response);
    } else {
      console.log(`An error occurred: ${request.statusText}`)
    }
  });
  request.send(JSON.stringify(payload));
});*/
