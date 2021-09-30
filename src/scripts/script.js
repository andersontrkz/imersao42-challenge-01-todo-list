window.onload = () => {
  getStoredTaskList();

  actionEventsListener();

  setCurrentDate();

  var t1 = tagger(document.querySelector('[name="tags"]'), {
    allow_duplicates: false,
    allow_spaces: true,
    add_on_blur: true,
    tag_limit: 4,
    completion: {list: ['foo', 'bar', 'baz']}
  });
  var t2 = tagger(document.querySelector('[name="tags2"]'), {
      allow_duplicates: false,
      allow_spaces: true,
      completion: {
          list: function() {
              return Promise.resolve(['foo', 'bar', 'baz', 'foo-baz']);
          }
      },
  });
  var t3 = tagger(document.querySelectorAll('[name^="tags3"]'), {
      allow_duplicates: false,
      allow_spaces: true,
  });
};

let taskObject = {};
const task_list = document.getElementById('task-list');

const setCurrentDate = () => {
  const startDateInput = document.getElementById('task-start-date');

  startDateInput.value = new Date().toISOString().split('T')[0];
};

const actionEventsListener = () => {
  const addButton = document.getElementById('add-task');
  const clearListButton = document.getElementById('clear-task-list');
  const taskInput = document.getElementById('task');
  const endDate = document.getElementById('task-end-date');
  const orderAscButton = document.getElementById('order-asc-task-list');
  const orderDescButton = document.getElementById('order-desc-task-list');

  orderAscButton.addEventListener('click', orderByEndDateAsc);
  orderDescButton.addEventListener('click', orderByEndDateDesc);
  endDate.addEventListener('input', validateFields);
  taskInput.addEventListener('input', validateFields);
  addButton.addEventListener('click', addTask);
  clearListButton.addEventListener('click', clearList);
};

const deleteTask = async (deleteButton) => {
  if (confirm('Deseja apagar esta atividade?')) {
    const card = deleteButton.parentNode.parentNode;

    await deleteButton.parentNode.parentNode.parentNode.removeChild(card);

    await storeTaskList();
  } else {
    alert('Ok, nenhuma ação foi feita!');
  };
};

const convertToGlobalDate = (date) => {
  const dateArray = date.split('/');

  return new Date (`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`).toISOString().split('T')[0];
}

const editTask = (editButton) => {
  const cards = document.querySelectorAll('.task-card__main');
  const card = editButton.parentNode.parentNode;
  const task = card.firstChild.innerText.split(': ')[1];
  const startDate = card.firstChild.nextSibling.innerText.split(': ')[1];
  const endDate = card.firstChild.nextSibling.nextSibling.innerText.split(': ')[1];
  const status = card.firstChild.nextSibling.nextSibling.nextSibling.innerText.split(': ')[1];
  const priority = card.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.split(': ')[1];
  const tags = card.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.split(': ')[1];

  const taskInput = document.getElementById('task');
  const taskStatusInput = document.getElementById('task-status');
  const taskPrioriryInput = document.getElementById('task-priority');
  const endDateInput = document.getElementById('task-end-date');
  const startDateInput = document.getElementById('task-start-date');

  taskInput.value = task;
  startDateInput.value = convertToGlobalDate(startDate);
  endDateInput.value =  convertToGlobalDate(endDate);
  taskStatusInput.value = status;
  taskPrioriryInput.value = priority;

  const addButton = document.getElementById('add-task');
  addButton.removeAttribute('disabled');
  addButton.innerText = 'Salvar';

  cards.forEach((c) => {
    if (c.classList.contains("task-card__selected")) {
      c.classList.remove("task-card__selected");
    };
  });

  card.classList.add("task-card__selected");


};

const moveUpTask = (moveUpButton) => {
  const row = moveUpButton.parentNode.parentNode;

  if (row != task_list.firstChild) {
    task_list.insertBefore(row, row.previousSibling);
  }

  storeTaskList();
};

const moveDownTask = (moveDownButton) => {
  const row = moveDownButton.parentNode.parentNode;

  if (row != task_list.lastChild) {
    task_list.insertBefore(row, row.nextSibling.nextSibling);
  }

  storeTaskList();
};

const generateActionColumn = () => {
  const actionSection = document.createElement('section');
  const moveUp = document.createElement('button');
  const moveDown = document.createElement('button');
  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  moveUp.innerText = '⏫ Mover para cima';
  moveDown.innerText = '⏬ Mover para baixo';
  editButton.innerText = '📝 Editar atividade';
  deleteButton.innerText = '⛔ Excluir atividade';

  moveUp.classList.add("move-up-task");
  moveDown.classList.add("move-down-task");
  editButton.classList.add("edit-task");
  deleteButton.classList.add("delete-task");

  actionSection.appendChild(moveUp);
  actionSection.appendChild(moveDown);
  actionSection.appendChild(editButton);
  actionSection.appendChild(deleteButton);

  actionSection.className = 'task-card__action-section';

  return actionSection;
};

const setActionColumnEvents = (taskList) => {
  const lastColumn = taskList.lastChild.lastChild.lastChild;

  taskList.lastChild.lastChild.firstChild.addEventListener('click',
  () => moveUpTask(lastColumn));

  taskList.lastChild.lastChild.lastChild.previousSibling.previousSibling.addEventListener('click',
  () => moveDownTask(lastColumn));

  taskList.lastChild.lastChild.lastChild.previousSibling.addEventListener('click',
  () => editTask(lastColumn));

  taskList.lastChild.lastChild.lastChild.addEventListener('click',
  () => deleteTask(lastColumn));
};

const taggerCardGenerator = (tags) => {
  if (tags[0] != '<') {
    let string = ''
  
    tags.split(',').forEach(tag => {
      string = string + `<div class="task-tagger__badge">${tag}</div>`;
    });
    
    return string;
  }

  return tags;
}

const generateTaskList = ({ task, startDate, endDate, taskStatus, tags, priority }) => {
  const taskCard = document.createElement("main");
  const taskSection = document.createElement("section");
  const startDateSection = document.createElement("section");
  const endDateSection = document.createElement("section");
  const statusSection = document.createElement("section");
  const tagsSection = document.createElement("section");
  const prioritySection = document.createElement("section");

  taskSection.innerHTML = `<b>Atividade</b>: ${task}`;
  startDateSection.innerHTML = `<b>Ínicio</b>: ${startDate}`;
  endDateSection.innerHTML = `<b>Término</b>: ${endDate}`;
  statusSection.innerHTML = `<b>Status</b>: ${taskStatus}`;
  prioritySection.innerHTML = `<b>Prioridade</b>: ${priority}`;
  tagsSection.innerHTML = `<b>Tags</b>: ${taggerCardGenerator(tags)}`;

  taskSection.className = 'task-card__task-section';
  startDateSection.className = 'task-card__start-date-section';
  endDateSection.className = 'task-card__end-date-section';
  statusSection.className = 'task-card__status-section';
  prioritySection.className = 'task-card__prioriry-section';
  tagsSection.className = 'task-card__tagger-section';

  taskCard.appendChild(taskSection);
  taskCard.appendChild(startDateSection);
  taskCard.appendChild(endDateSection);
  taskCard.appendChild(statusSection);
  taskCard.appendChild(prioritySection);
  taskCard.appendChild(tagsSection);

  taskCard.appendChild(generateActionColumn());

  taskCard.className = 'task-card__main';

  task_list.appendChild(taskCard);

  setActionColumnEvents(task_list);
};

const clearTaskForm = () => {
  const taskInput = document.getElementById('task');
  const taskStatus = document.getElementById('task-status');
  const taskPrioriry = document.getElementById('task-priority');
  const endDateInput = document.getElementById('task-end-date');
  const taskTagger = document.querySelectorAll('[name="tags1"]')[0]

  taskInput.value = '';
  taskStatus.value = 'Incompleto';
  taskPrioriry.value = 'Indiferente';
  endDateInput.value = '';
  taskTagger.value = '';

  setCurrentDate();
};

const dateFormatter = (date) => {
  const [year, month , day] = date.split("-");

  return `${day}/${month}/${year}`;
}

const saveTask = ({ task, startDate, endDate, taskStatus, tags, priority }) => {
  const selectedCard = document.querySelector('.task-card__selected');

  selectedCard.firstChild.innerHTML = `<b>Atividade</b>: ${task}`;
  selectedCard.firstChild.nextSibling.innerHTML = `<b>Ínicio</b>: ${startDate}`;
  selectedCard.firstChild.nextSibling.nextSibling.innerHTML = `<b>Término</b>: ${endDate}`;
  selectedCard.firstChild.nextSibling.nextSibling.nextSibling.innerHTML = `<b>Status</b>: ${taskStatus}`;
  selectedCard.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = `<b>Prioridade</b>: ${priority}`;
  selectedCard.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = `<b>Tags</b>: ${taggerCardGenerator(tags)}`;
}

const addTask = () => {  
  const addButton = document.getElementById('add-task');
  const endDate = document.getElementById('task-end-date').value;
  const startDate = document.getElementById('task-start-date').value;

  taskObject.task = document.getElementById('task').value;
  taskObject.taskStatus = document.getElementById('task-status').value;
  taskObject.startDate = dateFormatter(startDate);
  taskObject.endDate = dateFormatter(endDate);
  taskObject.priority = document.getElementById('task-priority').value;
  taskObject.tags = document.getElementById('task-tagger').value;
  
  if (addButton.innerText === 'Salvar') {
    saveTask(taskObject);
  } else {
    generateTaskList(taskObject);
  }

  storeTaskList();
  clearTaskForm();

  addButton.setAttribute('disabled', true)
};

const clearList = () => {
  while (task_list.firstChild) {
    task_list.removeChild(task_list.firstChild);
  };

  storeTaskList();
};

const storeTaskList = () => {
  const taskListStore = [];

  for (let index = 0; index < task_list.childElementCount; index += 1) {
    taskListStore.push({
      task: (task_list.children[index].children[0].innerHTML).split(': ')[1],
      startDate: (task_list.children[index].children[1].innerHTML).split(': ')[1],
      endDate: (task_list.children[index].children[2].innerHTML).split(': ')[1],
      taskStatus: (task_list.children[index].children[3].innerHTML).split(': ')[1],
      priority: (task_list.children[index].children[4].innerHTML).split(': ')[1],
      tags: (task_list.children[index].children[5].innerHTML).split(': ')[1],
    });
  };
  
  localStorage.setItem("taskList", JSON.stringify(taskListStore));
};

const getStoredTaskList = () => {
  const storedTaskList = JSON.parse(localStorage.getItem('taskList'))
  
  if (!storedTaskList) return;
  
  for (let index = 0; index < storedTaskList.length; index += 1) {
    taskObject.task = storedTaskList[index].task;
    taskObject.startDate = storedTaskList[index].startDate;
    taskObject.endDate = storedTaskList[index].endDate;
    taskObject.taskStatus = storedTaskList[index].taskStatus;
    taskObject.priority = storedTaskList[index].priority;
    taskObject.tags = storedTaskList[index].tags;

    generateTaskList(taskObject);
  };
};


const validateFields = () => {
  const addButton = document.getElementById('add-task');
  const task = document.getElementById('task').value;
  const endDate = document.getElementById('task-end-date').value;

  if (!task || !endDate) {
    addButton.setAttribute('disabled', true);
  } else {
    addButton.removeAttribute('disabled');
  }
};

const convertToOrdenableDate = (date) => {
  const [day, month, year] = date.split("/");
  
  return `${year}${month}${day}`;
}

const orderByEndDateAsc = () => {
  const storedTaskList = JSON.parse(localStorage.getItem('taskList'));

  const orderedTasksAsc = storedTaskList.sort((taskA, taskB) =>  {
    if (convertToOrdenableDate(taskA.endDate) > convertToOrdenableDate(taskB.endDate)) {
      return 1;
    }
    if (convertToOrdenableDate(taskA.endDate) < convertToOrdenableDate(taskB.endDate)) {
      return -1;
    }
  });

  localStorage.setItem('taskList', JSON.stringify(orderedTasksAsc));

  location.reload();
}

const orderByEndDateDesc = () => {
  const storedTaskList = JSON.parse(localStorage.getItem('taskList'));

  const orderedTasksDesc = storedTaskList.sort((taskA, taskB) =>  {
    if (convertToOrdenableDate(taskA.endDate) > convertToOrdenableDate(taskB.endDate)) {
      return -1;
    }
    if (convertToOrdenableDate(taskA.endDate) < convertToOrdenableDate(taskB.endDate)) {
      return 1;
    }
  });

  localStorage.setItem('taskList', JSON.stringify(orderedTasksDesc));

  location.reload();
}

