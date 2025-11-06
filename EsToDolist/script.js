const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

const soundClick = document.getElementById("sound-click");
const soundSuccess = document.getElementById("sound-success");
const soundDelete = document.getElementById("sound-delete");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function playSound(sound) {
  sound.currentTime = 0;
  sound.volume = 0.4;
  sound.play();
}

// Partículas mais ricas e suaves
function sparkleEffect(x, y, color = "#00ffb3") {
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = `${x + (Math.random() * 20 - 10)}px`;
    sparkle.style.top = `${y + (Math.random() * 20 - 10)}px`;
    sparkle.style.background = color;
    sparkle.style.boxShadow = `0 0 15px ${color}`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}

function renderTasks() {
  taskList.innerHTML = "";
  const search = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  tasks
    .filter(t => t.text.toLowerCase().includes(search))
    .filter(t => (filter === "all" ? true : filter === "done" ? t.done : !t.done))
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task" + (task.done ? " done" : "");
      li.innerHTML = `
        <span>${task.text}</span>
        <div>
          <button class="btn-edit">✎</button>
          <button class="btn-del">✖︎</button>
        </div>
      `;

      li.querySelector(".btn-edit").onclick = (e) => {
        e.stopPropagation();
        playSound(soundClick);
        editTask(index);
      };
      li.querySelector(".btn-del").onclick = (e) => {
        e.stopPropagation();
        playSound(soundDelete);
        deleteTask(li, index);
      };
      li.onclick = (e) => {
        if (!e.target.closest("button")) {
          toggleDone(index);
          playSound(soundSuccess);
          sparkleEffect(e.clientX, e.clientY, "#00ffb3");
        }
      };

      taskList.appendChild(li);
    });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  saveTasks();
  taskInput.value = "";
  playSound(soundSuccess);

  const rect = addBtn.getBoundingClientRect();
  sparkleEffect(rect.x + rect.width / 2, rect.y + rect.height / 2, "#00ffb3");
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Editar tarefa:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(element, index) {
  element.classList.add("remove");
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }, 300);
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);
taskInput.addEventListener("keypress", (e) => e.key === "Enter" && addTask());

renderTasks();
