window.onload = () => {
  getStoredTaskList();

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
};

const clearTaskForm = () => {
  const taskInput = document.getElementById('task');
  const taskStatus = document.getElementById('task-status');
  const endDateInput = document.getElementById('task-end-date');

  taskInput.value = '';
  taskStatus.value = 'Incompleto';
  endDateInput.value = '';
};

const addTask = () => {
  const taskList = document.getElementById('task-list');
  const taskRow = document.createElement("tr");

  const task = document.getElementById('task').value;
  const startDate = document.getElementById('task-start-date').value;
  const endDate = document.getElementById('task-end-date').value;
  const taskStatus = document.getElementById('task-status').value;

  const taskColumn = document.createElement("td");
  const startDateColumn = document.createElement("td");
  const endDateColumn = document.createElement("td");
  const taskStatusColumn = document.createElement("td");

  taskColumn.innerHTML = task;
  startDateColumn.innerHTML = startDate;
  endDateColumn.innerHTML = endDate;
  taskStatusColumn.innerHTML = taskStatus; 

  taskRow.appendChild(taskColumn);
  taskRow.appendChild(startDateColumn);
  taskRow.appendChild(endDateColumn);
  taskRow.appendChild(taskStatusColumn);

  taskList.appendChild(taskRow);

  storeTaskList(task, startDate, endDate, taskStatus);
  clearTaskForm();
};

const clearList = () => {
  const taskList = document.getElementById('task-list');

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  };
};

const storeTaskList = () => {
  const taskList = document.getElementById('task-list');
  const taskListStore = [];

  for (let index = 0; index < taskList.childElementCount; index += 1) {
    taskListStore.push({
      task: taskList.children[index].children[0].innerHTML,
      startDate: taskList.children[index].children[1].innerHTML,
      endDate: taskList.children[index].children[2].innerHTML,
      taskStatus: taskList.children[index].children[3].innerHTML,
    });
  };

  localStorage.setItem("taskList", JSON.stringify(taskListStore));
};

const getStoredTaskList = () => {
  const storedTaskList = JSON.parse(localStorage.getItem('taskList'))
  
  if (!storedTaskList) return;
  
  const taskList = document.getElementById('task-list');
  
  for (let index = 0; index < storedTaskList.length; index += 1) {
    const taskRow = document.createElement("tr");
    const taskColumn = document.createElement("td");
    const startDateColumn = document.createElement("td");
    const endDateColumn = document.createElement("td");
    const taskStatusColumn = document.createElement("td");

    taskColumn.innerHTML = storedTaskList[index].task;
    startDateColumn.innerHTML = storedTaskList[index].startDate;
    endDateColumn.innerHTML = storedTaskList[index].endDate;
    taskStatusColumn.innerHTML = storedTaskList[index].taskStatus; 

    taskRow.appendChild(taskColumn);
    taskRow.appendChild(startDateColumn);
    taskRow.appendChild(endDateColumn);
    taskRow.appendChild(taskStatusColumn);

    taskList.appendChild(taskRow);
  };
};
