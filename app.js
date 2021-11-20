let add = document.querySelector("form button");
let section = document.querySelector("section");

add.addEventListener("click", (e) => {
  //prevent form  submitt
  e.preventDefault();

  //取得input值
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;
  let todoClassDone = false;
  //判斷輸入有無符合格式
  if (todoText === "") {
    alert("請輸入文字!");
    return;
  }
  if (todoMonth === "" || todoDate === "") {
    alert("請輸入日期!");
    return;
  }
  if (todoMonth < 1 || todoMonth > 12) {
    alert("請輸入正確月份!");
    return;
  }
  if (todoDate < 1 || todoDate > 31) {
    alert("請輸入正確日號!");
    return;
  }
  //-------------------------------------------------------------------------

  //創造一個todo item
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate;
  todo.appendChild(text);
  todo.appendChild(time);

  //create complete button
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="far fa-calendar-check"></i>';
  completeButton.addEventListener("click", (e) => {
    let todoDone = e.target.parentElement;
    //用add 若重複點選button就無作用
    //todoDone.classList.add("done");
    //用toggle ，若重複點button，class有done的時候就刪掉；沒有的時候就添加
    todoDone.classList.toggle("done");
  });
  //create trash can button
  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="far fa-trash-alt"></i>';
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    //使用事件animateionend
    todoItem.addEventListener("animationend", () => {
      //remove from localStorage
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1); //在找到todotext = text的索引，進行切除
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });

      todoItem.remove();
    });

    todoItem.style.animation = "scaleDown 0.35s forwards";
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  //animation
  todo.style.animation = "scaleUp 0.35s forwards";

  //create an object
  let todoObject = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
    todoClassDone: todoClassDone,
  };
  //Storage data into an array of objects
  let myList = localStorage.getItem("list");
  if (myList == null) {
    //若list是null 則添加item
    localStorage.setItem("list", JSON.stringify([todoObject]));
  } else {
    //若有值則先把原本存在的item提領出來
    let myListArray = JSON.parse(myList); //用一個變數來放這個轉成array的資料
    myListArray.push(todoObject); //然後把新的item 從後面加進去
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  //console.log(JSON.parse(localStorage.getItem("list")));

  form.children[0].value = ""; //clear input

  section.appendChild(todo);
});

loadData(); //要記得先執行該function
//創造實體物件，用function包起來方便給下面的sortButton使用
function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      //創造一個todo item
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      //create complete button
      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="far fa-calendar-check"></i>';
      completeButton.addEventListener("click", (e) => {
        let todoDone = e.target.parentElement;
        //用add 若重複點選button就無作用
        //todoDone.classList.add("done");
        //用toggle ，若重複點button，class有done的時候就刪掉；沒有的時候就添加
        todoDone.classList.toggle("done");
      });
      //create trash can button
      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="far fa-trash-alt"></i>';
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        //使用事件animateionend
        todoItem.addEventListener("animationend", () => {
          //remove from localStorage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1); //在找到todotext = text的索引，進行切除
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });

          todoItem.remove();
        });

        todoItem.style.animation = "scaleDown 0.35s forwards";
      }); //button-end

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      section.appendChild(todo);
    });
  }
}

//排序演算法--start
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  //當其中一邊沒有值，則直接把另一邊的值push到result後面
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sorButton = document.querySelector("div.sort button");
sorButton.addEventListener("click", () => {
  //sort Data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  //remove Data (and then load sorted Data)
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }
  //load sorted Data
  loadData();
});
//排序演算法--end

//最後判斷是儲存的ListArray裡面是否無值 ，沒有值的話就clear
let get = JSON.parse(localStorage.getItem("list")); //先取得目前的localStorage
if (get != null) {
  if (get.length == 0) {
    localStorage.clear();
  }
}
