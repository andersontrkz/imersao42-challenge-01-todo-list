window.onload = () => {
  const addButton = document.getElementById('add-task');
  const clearListButton = document.getElementById('clear-task-list');
  
  addButton.addEventListener('click', addTask);
  clearListButton.addEventListener('click', clearList);

  setCurrentDate();

};

const setCurrentDate = () => {
  const day = new Date().getDay();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  const startDateInput = document.getElementById('task-start-date');

  startDateInput.value = `${day}/${month}/${year}`;
}

const clearTaskForm = () => {
  const taskInput = document.getElementById('task');
  const taskStatus = document.getElementById('task-status');
  const endDateInput = document.getElementById('task-end-date');

  taskInput.value = '';
  taskStatus.value = 'Incompleto';
  endDateInput.value = '';
}

const addTask = () => {
  const taskList = document.getElementById('task-list');
  const newTask = document.createElement("li");
  const text = document.getElementById('task').value;

  const textTask = document.createTextNode(text);  

  newTask.appendChild(textTask);
  newTask.setAttribute('class', 'task');

  taskList.appendChild(newTask);

  clearTaskForm();
}

const clearList = () => {
  const taskList = document.getElementById('task-list');

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
}