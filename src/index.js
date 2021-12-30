import "./index.css";

let todoData = [];

function setLocalStorage(data) {
  localStorage.setItem("todoData", JSON.stringify(data));
}

function getLocalStorage() {
  todoData = JSON.parse(localStorage.getItem("todoData"));
}

getLocalStorage();

let listItems = null;
let pageNow = "all";
let dragSrcEl = null;

// DOM
const nav = document.querySelector("#nav");
const addBtn = document.querySelector("#addBtn");
const addCard = document.querySelector("#addCard");

const inputText = document.querySelector("#inputText");
const date = document.querySelector("#date");
const time = document.querySelector("#time");
const comment = document.querySelector("#comment");
const cancelBtn = document.querySelector("#cancel");
const todoList = document.querySelector("#todoList");
const submitTodoBtn = document.querySelector("#submitTodo");
const todoForm = document.querySelector("#todoForm");

const tasksLeft = document.querySelector("#tasksLeft");

function init() {
  renderTodoList(pageNow);
}
init();

// 資料渲染
function renderTodoList(page = pageNow) {
  let data = [];
  // 選擇渲染哪個頁籤
  if (page === "all") {
    data = todoData;
  } else if (page === "todo") {
    data = todoData.filter((item) => !item.completed);
  } else if (page === "done") {
    data = todoData.filter((item) => item.completed);
  }


  if (data.length === 0) {
    todoList.innerHTML = '<p class="text-[#aaaaaa] text-center">當前項目沒有待辦事項</p>';
    return;
  }
  let str = "";

  data.forEach((item) => {
    let dateStr = item.date;
    let commentStr = item.comment;
    dateStr = dateStr.split("-").join("/");

    if (dateStr === "yyyy/MM/dd" || dateStr === "") {
      dateStr = "";
    } else {
      dateStr = `<i class="bi bi-calendar3 mr-2"></i><span class="mr-4">${dateStr}</span>`;
    }

    if (commentStr !== "") {
      commentStr = `<i class="bi bi-chat-dots mr-2"></i><span class="mr-4">`;
    }

    str += /* HTML */ `
      <li
        class="draggable rounded overflow-hidden mb-2 relative cursor-grab active:cursor-grabbing"
        draggable="true"
      >
        <div
          id="dot-${item.id}"
          class="dot absolute w-2 h-[28px] left-2 top-[calc(50%-14px)] flex flex-col justify-between"
        >
          <div class="w-1 h-1 rounded bg-[#d8d8d8]"></div>
          <div class="w-1 h-1 rounded bg-[#d8d8d8]"></div>
          <div class="w-1 h-1 rounded bg-[#d8d8d8]"></div>
        </div>

        <div
          data-form-id="${item.id}"
          class="form-${item.id} ${item.star ? "bg-[#fff2dc]" : "bg-[#f2f2f2]"} pt-6"
        >
          <div class="flex items-center mb-6 px-8">
            <input
              type="checkbox"
              data-js="changeStatus"
              data-id="${item.id}"
              class="
              rounded-sm
              text-primary
              w-6
              h-6
              mr-4
              border-0
              cursor-pointer
              focus:ring-0 focus:ring-offset-0
            "
              ${item.completed ? "checked" : ""}
            />
            <input
              class="${item.completed
                ? "line-through text-[#9b9b9b]"
                : ""} text-2xl font-medium mr-auto border-0 py-0 px-0 bg-inherit focus:ring-0  cursor-grab active:cursor-grabbing"
              type="text"
              name=""
              data-id="${item.id}"
              value=" ${item.title}"
              disabled="disabled"
            />
            <i
              data-js="delete"
              data-id="${item.id}"
              class="bi bi-trash text-2xl mr-8 text-[#dddddd] hover:text-[#ff0000] cursor-pointer"
            ></i>
            <i
              data-js="star"
              data-id="${item.id}"
              class="bi ${item.star
                ? "bi-star-fill text-[#f5a623]"
                : "bi-star hover:text-[#f5a623]"}  text-2xl mr-8 cursor-pointer"
            ></i>
            <i
              data-js="edit"
              data-id="${item.id}"
              class="bi bi-pencil text-2xl hover:text-primary cursor-pointer"
            ></i>
          </div>
          <div class="form-body-${item.id}"></div>

          <div data-icon-area="${item.id}" class="flex items-center text-[#757575] px-8 -mt-[9px] pb-3">
            ${dateStr + commentStr}
          </div>
        </div>
      </li>
    `;
  });

  todoList.innerHTML = str;
  listItems = document.querySelectorAll(".draggable");
  renderTasksLeft();

  listItems.forEach((item) => {
    addEventsDragAndDrop(item);
  });
}

// 綁拖曳的監聽
function addEventsDragAndDrop(el) {
  el.addEventListener("dragstart", dragStart, false);
  el.addEventListener("dragover", dragOver, false);
  el.addEventListener("drop", dragDrop, false);
  el.addEventListener("dragend", dragEnd, false);
}

function dragStart(e) {
  this.classList.add("opacity-40");
  dragSrcEl = this;
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function dragDrop(e) {
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
  }
  return false;
}

function dragEnd(e) {
  this.classList.remove("opacity-400");
  this.classList.add("opacity-100");
  const idOrderArr = getIdOrder();
  sortTodoDataByDrag(idOrderArr);
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function getIdOrder() {
  const idOrderArr = [];
  const idList = document.querySelectorAll("[data-form-id]");
  idList.forEach((id) => {
    let idOrderVal = id.getAttribute("data-form-id");
    idOrderArr.push(idOrderVal);
  });
  return idOrderArr;
}

// 藉由拖曳改變資料順序
function sortTodoDataByDrag(arr) {
  const orders = arr;
  const newTodoData = [];

  todoData.forEach((todoObj, todoIdx) => {
    orders.forEach((order, orderIdx) => {
      if (todoObj.id === parseInt(orders[orderIdx])) {
        newTodoData[orderIdx] = todoObj;
      }
    });
  });
  todoData = newTodoData;
  setLocalStorage(todoData);
}

// 剩餘任務數量渲染
function renderTasksLeft() {
  let num = 0;
  todoData.forEach((item) => {
    if (item.completed === false) {
      num++;
    }
  });
  tasksLeft.innerHTML = `${num} tasks left`;
}

// 頁籤控制
function tabHandler(e) {
  if (e.target.nodeName === "A") {
    const tab = e.target.dataset.js;
    pageNow = tab;
    renderTodoList();
    renderTab();
  }
}
nav.addEventListener("click", tabHandler);
renderTab();

// 頁籤渲染
function renderTab(tab = pageNow) {
  const navLink = document.querySelectorAll("#nav a");
  navLink.forEach((item) => {
    if (item.classList.contains(tab)) {
      item.nextElementSibling.classList.remove("hidden");
      item.classList.add("text-white");
    } else {
      item.nextElementSibling.classList.add("hidden");
      item.classList.remove("text-white");
    }
  });
}

// 打開頂部表單
function openTodoForm() {
  addCard.classList.remove("hidden");
  addBtn.classList.add("hidden");
  inputText.focus();
}
addBtn.addEventListener("click", openTodoForm);

// 關閉表單
function closeTodoForm() {
  addCard.classList.add("hidden");
  addBtn.classList.remove("hidden");
  todoForm.reset();
}
cancelBtn.addEventListener("click", closeTodoForm);

// 新增待辦資料
function submitTodo() {
  if (inputText.value === "") {
    alert("待辦標題不得為空！");
    inputText.focus();
    return;
  }
  let dateStr = "";
  if (date.value !== "") {
    let dateArr = date.value.split("-");

    dateArr = dateArr.map((item, i) => {
      return parseInt(item);
    });

    dateArr = dateArr.map((item, i) => item.toString());
    dateStr = dateArr.join("-");
  }

  const obj = {
    id: Date.now(),
    title: inputText.value,
    completed: false,
    date: dateStr,
    time: time.value,
    file: "",
    comment: comment.value,
    star: false,
  };
  todoData.unshift(obj);

  renderTodoList();
  closeTodoForm();
  todoForm.reset();
  setLocalStorage(todoData);
}
submitTodoBtn.addEventListener("click", submitTodo);

// 編輯待辦
function editTodo(e) {
  // 改變鉛筆的 icon 顏色
  const targetClass = e.target.classList;

  if (targetClass.contains("bi-pencil-fill")) {
    cancelEdit(e.target);
    return;
  }
  targetClass.remove("bi-pencil");
  targetClass.add("bi-pencil-fill", "text-primary");

  // 取得編輯待辦的 id
  const id = parseInt(e.target.dataset.id);
  // 取得要渲染編輯表單的區塊
  const targetDiv = e.target.parentElement.nextElementSibling;

  // 隱藏底部 icon
  const icons = targetDiv.nextElementSibling;
  icons.classList.add("hidden");

  const editObj = todoData.find((item) => item.id === id);

  const str = renderEditForm(editObj);
  targetDiv.innerHTML = str;

  // 把 input 轉換成可點擊
  const editTitleInput = e.target.previousElementSibling.previousElementSibling.previousElementSibling;
  editTitleInput.disabled = false;
  // focus input
  editTitleInput.focus();
  // 讓游標移動到 input 內容的最尾端
  console.log(todoData);
  const len = editTitleInput.value.length;
  editTitleInput.selectionStart = len;

  targetDiv.addEventListener("click", editFormHandler);
}

// 編輯表單的按鈕控制
function editFormHandler(e) {
  let target = e.target;
  const doSomething = target.dataset.js;

  if (doSomething === undefined) return;

  if (doSomething === "cancelEdit") {
    cancelEdit(target);
  } else if (doSomething === "saveEdit") {
    saveEdit(target);
  }
}

// 取消編輯
function cancelEdit(para) {
  const { id } = para.dataset;

  const formBody = document.querySelector(`.form-body-${id}`);
  const penIcon = formBody.previousElementSibling.lastElementChild;
  penIcon.classList.remove("bi-pencil-fill", "text-primary");
  penIcon.classList.add("bi-pencil");

  formBody.nextElementSibling.classList.remove("hidden");
  formBody.innerHTML = "";
}

function saveEdit(para) {
  const targetId = para.dataset.id;
  const targetForm = document.querySelector(`.form-${targetId}`);
  const inputs = targetForm.querySelectorAll("input, textarea");
  const inputsArr = [...inputs];

  const val = inputsArr.map((item) => item.value.trim());

  const checkAttr = inputs[0].getAttribute("checked");

  let checkValue;
  if (checkAttr === "") {
    checkValue = true;
  } else if (checkAttr === null) {
    checkValue = false;
  }
  let star = null;

  const obj = {
    id: parseInt(targetId),
    completed: checkValue,
    title: val[1],
    date: val[2],
    time: val[3],
    file: val[4],
    comment: val[5]
  };
  todoData.forEach((item, index) => {
    if (item.id === parseInt(targetId)) {
      star = todoData[index].star;
      obj.star = star;
      todoData[index] = obj;
    }
  });
  alert("修改成功");
  setLocalStorage(todoData);
  renderTodoList();
}

function deleteTodo(e) {
  const id = parseInt(e.target.dataset.id);
  console.log(id);
  todoData.forEach((item, index) => {
    if (item.id === id) {
      todoData.splice(index, 1);
    }
  })
  setLocalStorage(todoData)
  renderTodoList();
  renderTasksLeft();


}
// 渲染編輯的待辦
function renderEditForm(item) {
  const renderObj = item;
  return /* HTML */ `
    <div class="bg-[#f2f2f2] rounded shadow-md overflow-hidden">
      <div data-id="${renderObj.id}">
        <div class="border-t-2 border-[#c8c8c8] px-[72px] pt-6">
          <div class="flex">
            <i class="bi bi-calendar3 mt-1 mr-[9px]"></i>
            <div>
              <h2 class="text-xl font-medium mb-2">Deadline</h2>
              <div class="flex mb-6">
                <input
                  data-id="${renderObj.id}"
                  type="date"
                  value="${renderObj.date}"
                  class="
                w-[162px]
                rounded-sm
                border-0
                focus:ring focus:ring-primary focus:ring-opacity-50
                mr-2
              "
                />
                <input
                  type="time"
                  data-id="${renderObj.id}"
                  value="${renderObj.time}"
                  class="w-[162px] rounded-sm border-0 focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>

          <div class="flex">
            <i class="bi bi-file-earmark mt-1 mr-[9px]"></i>
            <div>
              <h2 class="text-xl font-medium mb-2">File</h2>
              <div class="flex mb-6">
                <label for="editFile">
                  <div
                    class="
                  flex
                  w-8
                  h-8
                  bg-[#c8c8c8]
                  hover:bg-slate-500
                  justify-center
                  items-center
                  cursor-pointer
                "
                  >
                    <i class="bi bi-plus text-2xl text-white"></i>
                  </div>
                </label>
                <input type="file" class="hidden" id="editFile" />
              </div>
            </div>
          </div>
          <div class="flex">
            <i class="bi bi-chat-dots mt-1 mr-[9px]"></i>
            <div class="mb-6 flex-1">
              <h2 class="text-xl font-medium mb-2">Comment</h2>
              <textarea
                name=""
                data-id="${renderObj.id}"
                style="resize: none"
                class="
              w-full
              min-h-[120px]
              rounded-sm
              border-0
              focus:ring focus:ring-primary focus:ring-opacity-50
            "
                placeholder="Type your memo here..."
              >
${renderObj.comment}</textarea
              >
            </div>
          </div>
        </div>
        <div class="flex">
          <button
            data-id="${renderObj.id}"
            data-js="cancelEdit"
            type="button"
            class="
          flex
          py-4
          text-2xl
          w-1/2
          bg-white
          text-[#d0021b]
          hover:bg-[#fdfdfd]
          justify-center
          items-center
          cursor-pointer
        "
          >
            <i data-id="${renderObj.id}" data-js="cancelEdit" class="bi bi-x text-3xl"></i>
            Cancel
          </button>
          <button
            type="button"
            data-id="${renderObj.id}"
            data-js="saveEdit"
            class="
          flex
          py-4
          text-2xl
          w-1/2
          bg-primary
          text-white
          hover:bg-[#00408b]
          justify-center
          items-center
          cursor-pointer
        "
          >
            <i data-id="${renderObj.id}" class="bi bi-plus text-3xl text-white" data-js="saveEdit"></i>
            Save
          </button>
        </div>
      </div>
    </div>
  `;
}

// 待辦事項列表的控制
function todoListHandler(e) {
  const doSomething = e.target.dataset.js;
  if (doSomething === undefined) return;

  const { id } = e.target.dataset;
  const idNum = parseInt(id);

  if (doSomething === "changeStatus") {
    todoData.forEach((item, idx) => {
      if (idNum === item.id) {
        todoData[idx].completed = !todoData[idx].completed;
      }
    });
    setLocalStorage(todoData);
    renderTodoList();
  } else if (doSomething === "star") {
    todoData.forEach((item, idx) => {
      if (idNum === item.id) {
        todoData[idx].star = !todoData[idx].star;
      }
    });
    setLocalStorage(todoData);
    renderTodoList();
  } else if (doSomething === "edit") {
    editTodo(e);
  } else if (doSomething === "delete") {
    deleteTodo(e);
  }
}
todoList.addEventListener("click", todoListHandler);
