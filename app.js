let container = document.getElementById("container");
let taskForm = document.forms["new-task-form"];
let tasksDisplayer = document.getElementById("tasks-displayer");
let totalTasks = document.getElementById("total-tasks");

class Task {
  constructor(title, body, completed) {
    this.title = title;
    this.body = body;
    this.completed = completed;
    this.createdOn = createTime();
  }
  //in case the user doesn't enter a title
  set title(value) {
    if (value == "") {
      this._title = "Untitled";
      return;
    }
    this._title = value;
  }
}
//when submitting a new form
taskForm.addEventListener("submit", onFormSubmit);
//edit-delete-mark as done
container.addEventListener("click", handleCrude);

function onFormSubmit(e) {
  e.preventDefault();
  let task;
  //selecting form input fields
  let title = taskForm.title.value;
  let body = taskForm.body.value;
  let completed = taskForm.completed.checked;

  //creating a new Object
  task = new Task(title, body, completed);

  showTask(task);
  clearInputFields();
}

function showTask(task) {
  //creating new elements for tasks details (title, body ..)
  let taskHolder = document.createElement("div");
  let taskTitleHolder = document.createElement("div");
  let taskBodyHolder = document.createElement("div");
  let taskCreationTime = document.createElement("div");

  //creating delete/edit/complete BTNS
  let btnsContainer = document.createElement("div");
  let deleteBtn = document.createElement("button");
  let editBtn = document.createElement("button");
  let completeBtn = document.createElement("button");

  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  completeBtn.innerHTML = `<input type="checkbox" ${
    task.completed ? "checked" : false
  } />`;

  btnsContainer.append(deleteBtn, editBtn, completeBtn);

  //adding classes to task components
  taskHolder.className = "task-holder";
  if (task.completed) {
    taskTitleHolder.classList.add("done");
  }
  taskTitleHolder.classList.add("task-title");
  taskBodyHolder.classList.add("task-body");

  //adding classes to btns
  btnsContainer.className = "btns-container";
  deleteBtn.className = "delete-btn";
  editBtn.className = "edit-btn";
  completeBtn.className = "complete-btn";
  taskCreationTime.className = "task-time";
  //assigning values
  taskTitleHolder.innerHTML = task._title;
  taskBodyHolder.innerHTML = task.body;
  taskCreationTime.innerHTML = task.createdOn;

  //appending
  taskHolder.append(
    taskCreationTime,
    taskTitleHolder,
    taskBodyHolder,
    btnsContainer
  );
  tasksDisplayer.prepend(taskHolder);
  calcTotalTasks();
}

function clearInputFields() {
  title.value = "";
  body.value = "";
  completed.checked = false;
}

function createTime() {
  let date = new Date();

  let hours = date.getHours();
  if (hours < 10) hours = "0" + hours;
  if (hours > 12) hours = hours - 12;
  
  let mins = date.getMinutes();
  if (mins < 10) mins = "0" + mins;

  return `${hours}:${mins}`;
}

function handleCrude(event) {
  let target = event.target.closest("button");
  let task = event.target.closest(".task-holder");
  if (!target) return;

  let btn = target.getAttribute("class");
  //(1) delte task
  if (btn == "delete-btn") {
    target.closest(".task-holder").remove();
    calcTotalTasks();
  }

  //(2) mark task as done
  if (btn == "complete-btn") {
    task.querySelector(".task-title").classList.toggle("done");
    calcTotalTasks();
  }

  //(3)edit an existing task
  if (btn == "edit-btn") {
    editTask(target);
    function editTask(target) {
      let controlBtns, controlBtnsContainer, saveBtn, cancelBtn;

      let task = target.closest(".task-holder");
      let title = task.querySelector(".task-title");
      let body = task.querySelector(".task-body");

      let titleTextArea = document.createElement("textarea");
      let bodyTextArea = document.createElement("textarea");

      titleTextArea.innerHTML = title.innerHTML;
      bodyTextArea.innerHTML = body.innerHTML;
      //styling
      titleTextArea.classList.add("title-text-area");
      bodyTextArea.classList.add("body-text-area");

      title.replaceWith(titleTextArea);
      body.replaceWith(bodyTextArea);
      titleTextArea.focus();

      //hidding all the crud btns when editing
      target.parentNode.style.display = "none";

      createControlBtns();
      saveBtn.addEventListener("click", saveTask);
      cancelBtn.addEventListener("click", cancelTask);

      function saveTask() {
        title.innerHTML = titleTextArea.value;
        body.innerHTML = bodyTextArea.value;

        titleTextArea.replaceWith(title);
        bodyTextArea.replaceWith(body);
        //removing save/cancel btns
        //and showing crud btns
        controlBtnsContainer.remove();
        target.parentNode.style.display = "flex";
      }
      function cancelTask() {
        titleTextArea.replaceWith(title);
        bodyTextArea.replaceWith(body);
        //removing save/cancel btns
        //and showing crud btns
        controlBtnsContainer.remove();
        target.parentNode.style.display = "flex";
      }
      function createControlBtns() {
        //(1) create the btns
        controlBtns = `<div class='control-btns-container'><button class='edit-save'>Save</button><button class='edit-cancel'>Discard</button></div>`;
        task.insertAdjacentHTML("beforeend", controlBtns);
        //selecting them
        controlBtnsContainer = document.querySelector(
          ".control-btns-container"
        );
        saveBtn = document.querySelector(".edit-save");
        cancelBtn = document.querySelector(".edit-cancel");
      }

      //preventing any action on blur because
      //we will handle this using save/cancel btns
      titleTextArea.onblur = function (e) {
        e.preventDefault();
      };

      bodyTextArea.onblur = function (e) {
        e.preventDefault();
      };
    }
  }
}

function calcTotalTasks() {
  let total = tasksDisplayer.querySelectorAll(".task-holder").length;
  let completedTasks = tasksDisplayer.querySelectorAll(".done").length;
  totalTasks.innerHTML = completedTasks + "/" + total;
}

