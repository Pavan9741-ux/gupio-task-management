let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editTaskId = null;


// Get form elements

const taskForm = document.getElementById("taskForm");

const titleInput = document.getElementById("title");

const descriptionInput = document.getElementById("description");

const statusInput = document.getElementById("status");

const priorityInput = document.getElementById("priority");

const dueDateInput = document.getElementById("dueDate");

const taskList = document.getElementById("taskList");

const errorMessage = document.getElementById("errorMessage");


// Form submit

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();

    const description = descriptionInput.value.trim();

    const status = statusInput.value;

    const priority = priorityInput.value;

    const dueDate = dueDateInput.value;


    // Validation

    if (title === "") {

        errorMessage.textContent = "Please enter a task title.";

        return;
    }

    if (description === "") {

        errorMessage.textContent = "Please enter a description.";

        return;
    }

    if (dueDate === "") {

        errorMessage.textContent = "Please select a due date.";

        return;
    }
    const today = new Date().toISOString().split("T")[0];

    if (dueDate < today) {

        errorMessage.textContent =
            "Due date cannot be in the past.";

        return;
    }


    errorMessage.textContent = "";


    // Edit existing task

    if (editTaskId !== null) {

        const task = tasks.find(function(task) {

            return task.id === editTaskId;

        });


        if (task) {

            task.title = title;

            task.description = description;

            task.status = status;

            task.priority = priority;

            task.dueDate = dueDate;
        }


        editTaskId = null;

        document.getElementById("formTitle").textContent =
            "Add New Task";

        document.getElementById("submitButton").textContent =
            "Add Task";

        document.getElementById("cancelButton").style.display =
            "none";

    }

    // Create new task

    else {

        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            status: status,

            priority: priority,

            dueDate: dueDate

        };


        tasks.push(newTask);

    }


    saveTasks();

    displayTasks();

    taskForm.reset();

});


// Save tasks to browser

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Display tasks

function displayTasks() {

    const searchText =
        document.getElementById("searchInput").value
            .toLowerCase();

    const filterStatus =
        document.getElementById("filterStatus").value;


    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);


        const matchesStatus =
            filterStatus === "All" ||
            task.status === filterStatus;


        return matchesSearch && matchesStatus;

    });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            '<div class="empty">No tasks found.</div>';

    }


    filteredTasks.forEach(function(task) {

        const taskCard =
            document.createElement("div");

        taskCard.className = "task-card";


        taskCard.innerHTML = `

            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <div class="task-info">

                <span class="badge status-badge">
                    ${task.status}
                </span>

                <span class="badge priority-badge">
                    ${task.priority} Priority
                </span>

                <span class="badge date-badge">
                    Due: ${task.dueDate}
                </span>

            </div>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>
        `;


        taskList.appendChild(taskCard);

    });


    updateStatistics(filteredTasks);
}


// Update statistics

function updateStatistics(displayedTasks) {

    document.getElementById("totalTasks").textContent =
        tasks.length;

    document.getElementById("todoTasks").textContent =
        tasks.filter(task => task.status === "To Do").length;

    document.getElementById("progressTasks").textContent =
        tasks.filter(task => task.status === "In Progress").length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.status === "Completed").length;


    document.getElementById("taskCount").textContent =
        displayedTasks.length +
        (displayedTasks.length === 1 ? " task" : " tasks");

}


// Edit task

function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    titleInput.value = task.title;

    descriptionInput.value = task.description;

    statusInput.value = task.status;

    priorityInput.value = task.priority;

    dueDateInput.value = task.dueDate;


    editTaskId = id;


    document.getElementById("formTitle").textContent =
        "Edit Task";

    document.getElementById("submitButton").textContent =
        "Update Task";

    document.getElementById("cancelButton").style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Delete task

function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// Cancel edit

function cancelEdit() {

    editTaskId = null;

    taskForm.reset();

    document.getElementById("formTitle").textContent =
        "Add New Task";

    document.getElementById("submitButton").textContent =
        "Add Task";

    document.getElementById("cancelButton").style.display =
        "none";

    errorMessage.textContent = "";

}


// Initial display

displayTasks();