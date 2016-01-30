$(function(){

window.onload = function(){

const cookieAge = 365; //days the cookie will expire
var id;
/*---------ID functions---------*/
function createNewId() {
  var date = new Date();
  id = "" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
  return id;
}

/*---------cookie functions---------*/
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function readAllCookies() {
    var decodedCookies = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookies.split("; ");
    var numberOfCookies = cookieArray.length;
    var valueArray = new Array(numberOfCookies);
    for (var i = 0; i < numberOfCookies; i++) {
        var c = cookieArray[i];
        c = c.replace("task_" , "");
        valueArray[i] = new Array(2);
        valueArray[i][0] = c.substring(0, c.indexOf("=")); //ID
        valueArray[i][1] = c.substring(c.indexOf("=") + 1, c.length); //name
    }
    return valueArray;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

/*---------task functions---------*/
function updateTaskStatus(){
  //line through and greyed out if check-box was clicked
  var id = this.id.replace("cb_", "").replace("listElement_", "");
  var taskText = document.getElementById("task_" + id);
  var cb = document.getElementById("cb_" + id)

  //in case of dblclick event, checkbox has to switch states too
  if(this.nodeName == "LI"){
    if(!cb.checked){ cb.checked = true;}
    else{ cb.checked = false}
  }

  if(cb.checked){
    taskText.className = "checked";
    createCookie("task_" + id, taskText.textContent + "#done", cookieAge);
  }else{
    taskText.className = "unchecked";
    createCookie("task_" + id, taskText.textContent, cookieAge);
  }
}

function deleteTask(){
  var btnId = this.id.replace("btnDelete_", "");
  eraseCookie("task_" + btnId);
  $("#listElement_" + btnId).slideToggle(600, function() { $(this).remove(); } );
}

function editTask(){
  var id = this.id.replace("btnEdit_", "");
  var currentText = document.getElementById("task_" + id);
  var newText = prompt("Edit:", currentText.textContent);
  if(!newText || newText == ""){
    return false;
  }else{
  createCookie("task_" + id, newText, cookieAge);
  $("#task_" + id).text(newText);
  }
}

//NEW TASK BUTTON: each new task element shall look like this:
//	<li><input type="checkbox"/>
//    <span>hacer la cama</span>
//      <button id="btnDelete"><i class="fa fa-trash-o"></i></button>
//      <button id="btnEdit"><i class="fa fa-pencil"></i></button>
//  </li>
function addNewTasks(list, taskText) {
  createNewId();
  var listTask = document.createElement("li")
  listTask.id = "listElement_" + id;
  listTask.ondblclick = updateTaskStatus;
  var checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.id = "cb_" + id;
  checkBox.onclick = updateTaskStatus;

  var span = document.createElement("span");
  span.id = "task_" + id;
  span.textContent = taskText.replace("#done", "");

  var btnDelete = document.createElement("button");
  btnDelete.id = "btnDelete_" + id;
  var iconDel = document.createElement("i");
  iconDel.className = "fa fa-trash-o";
  btnDelete.onclick = deleteTask;

  var btnEdit = document.createElement("button");
  btnEdit.id = "btnEdit_" + id;
  var iconEdit = document.createElement("i");
  iconEdit.className = "fa fa-pencil";
  btnEdit.onclick = editTask;

  listTask.appendChild(checkBox);
  listTask.appendChild(span);
  listTask.appendChild(btnDelete);
  btnDelete.appendChild(iconDel);
  listTask.appendChild(btnEdit);
  btnEdit.appendChild(iconEdit);
  list.appendChild(listTask);

  $("#listElement_" + id).hide().slideToggle(600);
}

function loadTask(cookieId, taskText) {
  var list = document.getElementById("tasks");
  var listTask = document.createElement("li")
  listTask.id = "listElement_" + cookieId;
  listTask.ondblclick = updateTaskStatus;
  var checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.id = "cb_" + cookieId;
  checkBox.onclick = updateTaskStatus;

  var span = document.createElement("span");
  span.id = "task_" + cookieId;
  span.textContent = taskText;

  if(taskText.indexOf("#done") !=  -1){
    span.textContent = taskText.replace("#done", "");
    checkBox.checked = true;
    span.className = "checked";
  }

  var btnDelete = document.createElement("button");
  btnDelete.id = "btnDelete_" + cookieId;
  var iconDel = document.createElement("i");
  iconDel.className = "fa fa-trash-o";
  btnDelete.onclick = deleteTask;

  var btnEdit = document.createElement("button");
  btnEdit.id = "btnEdit_" + cookieId;
  var iconEdit = document.createElement("i");
  iconEdit.className = "fa fa-pencil";
  btnEdit.onclick = editTask;

  listTask.appendChild(checkBox);
  listTask.appendChild(span);
  listTask.appendChild(btnDelete);
  btnDelete.appendChild(iconDel);
  listTask.appendChild(btnEdit);
  btnEdit.appendChild(iconEdit);
  list.appendChild(listTask);

  $("#listElement_" + cookieId).hide().slideToggle(600);
}

//Coursor is ready to hit after loading the page
var inText = document.getElementById("inText");
inText.focus();

//Press Enter: e.which (13)
//function will add new task to list and clear input box
inText.onkeyup = function(e){

    if(e.which == 13){
      var taskText = inText.value;
      if(taskText == ""){
        return false;
      }
      addNewTasks(document.getElementById("tasks"), taskText);
      createCookie("task_" + id, taskText, cookieAge);
      inText.value = "";
    }
}

//Click on NewTaskButton:
//function will add new task to list and clear input box
var btnNew = document.getElementById("btnNew");
btnNew.onclick = function(){

  var taskText = inText.value;
  if(taskText == ""){
    return false;
  }
  addNewTasks(document.getElementById("tasks"), taskText);
  createCookie("task_" + id, taskText, cookieAge);
  inText.value = "";
}

//LOAD SAVED COOKIES
function loadSavedCookies(){
    if(document.cookie){
      var valueArray = readAllCookies();
      for (var i = 0; i < valueArray.length; i++) {
        loadTask(valueArray[i][0],valueArray[i][1]);
      }
    }
}

loadSavedCookies();

//smooth fade in
$("#heading").toggle().fadeToggle(4000);
$("#tasks").delay(1000).slideDown(2000);
$("#tasks").sortable();
};

});
