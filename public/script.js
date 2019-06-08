document.addEventListener('DOMContentLoaded', function(event) {
  bindButtons();
});

function bindButtons() {
  var deleteButtons = document.getElementsByClassName('workoutDelete');
  for (var i = 0; i < deleteButtons.length; i++) {
    // Add an event listener to each delete button
    bindDelete(deleteButtons[i]);
  }

  var updateButtons = document.getElementsByClassName('workoutUpdate');
  for (var i = 0; i < deleteButtons.length; i++) {
    // Add an event listener to each update button
    bindUpdate(updateButtons[i]);
  }

  // Add an event listener for the new workout submission form
  bindAdd(document.getElementById('workoutSubmit'));
}

function bindDelete(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var request = new XMLHttpRequest();
    var payload = {
      delete: true,
      id: button.parentNode.lastElementChild.value // The form's hidden input value/workout ID
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

function bindUpdate(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var request = new XMLHttpRequest();
    var payload = {
      update: true,
      id: button.parentNode.lastElementChild.value
    };
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

  var formCell = newRow.insertCell(4)

  var form = document.createElement('form');
  var updateInput = document.createElement('input');
  var deleteInput = document.createElement('input');

  updateInput.setAttribute('type', 'submit');
  updateInput.setAttribute('value', 'Update');
  updateInput.setAttribute('class', 'workoutUpdate');

  deleteInput.setAttribute('type', 'submit');
  deleteInput.setAttribute('value', 'Delete');
  deleteInput.setAttribute('class', 'workoutDelete');

  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('value', content.id);

  form.appendChild(updateInput);
  form.appendChild(deleteInput);
  form.appendChild(hiddenInput);
  // Add event listeners to the new form submission buttons
  bindUpdate(updateInput);
  bindDelete(deleteInput);
  // Add the form to the cell in our added row.
  formCell.appendChild(form);
}
