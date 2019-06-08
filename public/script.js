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
        deleteRow('workoutsTable', row);
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

function createUpdateForm(contents) {
  var name = contents[0];
  var reps = contents[1];
  var weight = contents[2].split(' ')[0];
  var units;

  if (contents[2].split(' ')[1] == 'lbs') {
    units = 1;
  } else {
    units = 0;
  }

  var date = contents[3];
  if (date == '0000-00-00') {
    date = Date.now();
  }
  date = new Date(date).toISOString().split('T')[0];

  var id = contents[4];

  var updateForm = document.createElement('form');
  updateForm.setAttribute('id', 'updateForm');

  var nameLabel = document.createElement('label');
  nameLabel.textContent = 'Name';

  var nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('name', 'name');
  nameInput.setAttribute('value', name);
  nameLabel.appendChild(nameInput);

  var repsLabel = document.createElement('label');
  repsLabel.textContent = 'Reps';

  var repsInput = document.createElement('input');
  repsInput.setAttribute('type', 'number');
  repsInput.setAttribute('name', 'reps');
  repsInput.setAttribute('value', reps);
  repsLabel.appendChild(repsInput);

  var weightLabel = document.createElement('label');
  weightLabel.textContent = 'Weight';

  var weightInput = document.createElement('input');
  weightInput.setAttribute('type', 'number');
  weightInput.setAttribute('name', 'weight');
  weightInput.setAttribute('value', weight);
  weightLabel.appendChild(weightInput);

  var lbsLabel = document.createElement('label');
  var lbsSelect = document.createElement('select');
  lbsSelect.setAttribute('name', 'lbs');

  var lbsOption = document.createElement('option');
  lbsOption.setAttribute('value', 1);
  lbsOption.textContent = 'lbs';

  var kgOption = document.createElement('option');
  kgOption.setAttribute('value', 0);
  kgOption.textContent = 'kg';

  if (units == 1) {
    lbsOption.toggleAttribute('selected');
  } else {
    kgOption.toggleAttribute('selected');
  }

  lbsSelect.appendChild(lbsOption);
  lbsSelect.appendChild(kgOption);
  lbsLabel.appendChild(lbsSelect);

  var dateLabel = document.createElement('label');
  dateLabel.textContent = 'Date';

  var dateInput = document.createElement('input');
  dateInput.setAttribute('type', 'date');
  dateInput.setAttribute('name', 'date');
  dateInput.setAttribute('value', date);
  dateLabel.appendChild(dateInput);

  var saveInput = document.createElement('input');
  saveInput.setAttribute('type', 'submit');
  saveInput.setAttribute('value', 'Save');
  saveInput.setAttribute('class', 'workoutSave');

  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('value', id);

  updateForm.appendChild(nameLabel);
  updateForm.appendChild(repsLabel);
  updateForm.appendChild(weightLabel);
  updateForm.appendChild(lbsLabel);
  updateForm.appendChild(dateLabel);
  updateForm.appendChild(saveInput);
  updateForm.appendChild(hiddenInput);
  bindSave(saveInput);

  document.getElementById('workoutsTable').insertAdjacentElement('beforebegin', updateForm);

  /*<form id="workoutForm">

    <label>Date
      <input type="date" name="date" id="date">
    </label>
    <br />
    <input type="submit" value="Add this workout" id="workoutSubmit">
  </form>*/

}

function bindSave(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var request = new XMLHttpRequest();
    var updateForm = button.parentNode;
    var payload = {
      update: true,
      name: updateForm.elements[0].value,
      reps: updateForm.elements[1].value,
      weight: updateForm.elements[2].value,
      lbs: updateForm.elements[3].value,
      date: updateForm.elements[4].value,
      id: updateForm.elements[6].value
    };
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function() {
      if (request.status >= 200 && request.status < 400) {
        console.log(request.responseText);
        // DEBUG: toggle the table's disabled buttons, delete the form and update values
      } else {
        console.error(`An error occurred: ${request.statusText}`);
      }
    });
    request.send(JSON.stringify(payload));
  });
}

function bindUpdate(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    row = button.parentNode.parentNode.parentNode;
    cells = row.getElementsByTagName('td');
    var content = [];
    for (var i = 0; i < cells.length - 1; i++) {
      // Add the text values from the cell we're in into an array
      content.push(cells[i].textContent);
    }
    // Get the ID of the hidden input and add it to the array
    content.push(cells[cells.length - 1].lastElementChild.lastElementChild.value);
    createUpdateForm(content);
    // Disable updating or deleting this row until the update is saved
    button.toggleAttribute('disabled');
    button.nextElementSibling.toggleAttribute('disabled');
  });
}

function bindAdd(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var request = new XMLHttpRequest();

    var addForm = document.getElementById('workoutForm');
    var payload = {
      add: true,
      name: addForm.elements[0].value,
      reps: addForm.elements[1].value,
      weight: addForm.elements[2].value,
      lbs: addForm.elements[3].value,
      date: addForm.elements[4].value
    };
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function() {
      if (request.status >= 200 && request.status < 400) {
        console.log(request.responseText);
        addRow('workoutsTable', JSON.parse(request.responseText));
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
