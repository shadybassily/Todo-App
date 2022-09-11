let container = document.getElementById("container");
let taskForm = document.forms["new-task-form"];
let tasks = [];

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
  tasks.push(task);

  showTask(task);
  clearInputFields();
}

function showTask(task) {
  //selecting where the tasks are displayed
  let tasksDisplayer = document.getElementById("tasks-displayer");

  //creating new elements for tasks details (title, body ..)
  let taskHolder = document.createElement("div");
  let taskTitleHolder = document.createElement("div");
  let taskBodyHolder = document.createElement("div");

  //creating delete/edit/complete BTNS
  let btnsContainer = document.createElement("div");
  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "delete";
  let editBtn = document.createElement("button");
  editBtn.innerHTML = "edit";
  let completeBtn = document.createElement("button");
  completeBtn.innerHTML = "done";

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

  //assigning values
  taskTitleHolder.innerHTML = task._title;
  taskBodyHolder.innerHTML = task.body;

  //appending
  taskHolder.append(taskTitleHolder, taskBodyHolder, btnsContainer);
  tasksDisplayer.prepend(taskHolder);
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
  let mins = date.getMinutes();
  if (mins < 10) mins = "0" + mins;

  return `${hours}:${mins}`;
}

function handleCrude(event) {
  let target = event.target.closest("button");
  if (!target) return;

  let btn = target.getAttribute("class");
  //(1) delte task
  if (btn == "delete-btn") {
    target.closest(".task-holder").remove();
  }

  //(2) mark task as done
  if (btn == "complete-btn") {
    target
      .closest(".task-holder")
      .querySelector(".task-title")
      .classList.toggle("done");
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
      titleTextArea.classList.add("text-area");
      bodyTextArea.classList.add("text-area");

      title.replaceWith(titleTextArea);
      body.replaceWith(bodyTextArea);
      titleTextArea.focus();

      //hidding all the crud btns when editing
      target.parentNode.hidden = true;
      
      createControlBtns();
      saveBtn.addEventListener("click", saveTask);
      cancelBtn.addEventListener("click", cancelTask);



      function saveTask(e) {
        title.innerHTML = titleTextArea.value;
        body.innerHTML = bodyTextArea.value;
        
        titleTextArea.replaceWith(title);
        bodyTextArea.replaceWith(body);
        //removing save/cancel btns
        //and showing crud btns
        controlBtnsContainer.remove()
        target.parentNode.hidden = false;
      }
      function cancelTask(e) {
        titleTextArea.replaceWith(title);
        bodyTextArea.replaceWith(body);
        //removing save/cancel btns
        //and showing crud btns
        controlBtnsContainer.remove()
        target.parentNode.hidden = false;
      }
      function createControlBtns() {
        //(1) create the btns
        controlBtns = `<div class='control-btns-container'><button class='edit-save'>Save</button><button class='edit-cancel'>Cancel</button></div>`;
        task.insertAdjacentHTML("beforeend", controlBtns);
        //selecting them
        controlBtnsContainer = document.querySelector(".control-btns-container");
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
