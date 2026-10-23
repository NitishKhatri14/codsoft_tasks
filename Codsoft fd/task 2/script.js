
document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskTitle = document.getElementById("taskTitle");
    const taskCategory = document.getElementById("taskCategory");
    const taskPriority = document.getElementById("taskPriority");
    const taskDueDate = document.getElementById("taskDueDate");

    const taskList = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    const emptyTitle = document.getElementById("emptyTitle");
    const emptyMessage = document.getElementById("emptyMessage");

    const totalCount = document.getElementById("totalCount");
    const pendingCount = document.getElementById("pendingCount");
    const completedCount = document.getElementById("completedCount");

    const searchInput = document.getElementById("searchInput");
    const filterStatus = document.getElementById("filterStatus");
    const filterCategory = document.getElementById("filterCategory");
    const sortPriority = document.getElementById("sortPriority");

    const submitBtn = document.getElementById("submitBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const formTitle = document.getElementById("formTitle");
    const titleError = document.getElementById("titleError");
    const themeToggle = document.getElementById("themeToggle");

    const STORAGE_KEY = "taskFlowTasks";
    const THEME_KEY = "taskFlowTheme";

    let tasks = loadTasks();
    let editingId = null;

    // Display today's date
    document.getElementById("todayDate").textContent =
        new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("year").textContent =
        new Date().getFullYear();

    // Load tasks safely from Local Storage
    function loadTasks() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : [];

            return Array.isArray(parsed) ? parsed.filter(function (task) {
                return task &&
                    typeof task.id === "string" &&
                    typeof task.title === "string" &&
                    typeof task.completed === "boolean";
            }) : [];
        } catch (error) {
            return [];
        }
    }

    // Save tasks
    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            alert("Unable to save tasks. Check your browser storage settings.");
        }
    }

    // Apply the saved theme
    function applyTheme(theme) {
        document.body.classList.toggle("dark", theme === "dark");
        themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
        themeToggle.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem(THEME_KEY) || "light";
    } catch (error) {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", function () {
        const newTheme = document.body.classList.contains("dark")
            ? "light"
            : "dark";

        applyTheme(newTheme);

        try {
            localStorage.setItem(THEME_KEY, newTheme);
        } catch (error) {
            // Theme still works for the current page.
        }
    });

    // Reset the form after adding or cancelling an edit
    function resetForm() {
        taskForm.reset();
        editingId = null;
        formTitle.textContent = "Add a New Task";
        submitBtn.textContent = "+ Add Task";
        cancelEditBtn.hidden = true;
        titleError.textContent = "";
        taskTitle.style.borderColor = "";
    }

    cancelEditBtn.addEventListener("click", resetForm);

    // Add a new task or update an existing task
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = taskTitle.value.trim();

        if (!title) {
            titleError.textContent = "Please enter a task name.";
            taskTitle.focus();
            return;
        }

        if (title.length > 120) {
            titleError.textContent =
                "Task name cannot exceed 120 characters.";
            taskTitle.focus();
            return;
        }

        titleError.textContent = "";

        if (editingId !== null) {
            tasks = tasks.map(function (task) {
                if (task.id === editingId) {
                    return {
                        ...task,
                        title: title,
                        category: taskCategory.value,
                        priority: taskPriority.value,
                        dueDate: taskDueDate.value
                    };
                }

                return task;
            });
        } else {
            tasks.unshift({
                id: createId(),
                title: title,
                category: taskCategory.value,
                priority: taskPriority.value,
                dueDate: taskDueDate.value,
                completed: false,
                createdAt: Date.now()
            });
        }

        saveTasks();
        resetForm();
        renderTasks();
    });

    // Generate a unique task ID
    function createId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return Date.now().toString() + "-" +
            Math.random().toString(36).slice(2);
    }

    // Edit a task
    function editTask(id) {
        const task = tasks.find(function (item) {
            return item.id === id;
        });

        if (!task) return;

        editingId = id;
        taskTitle.value = task.title;
        taskCategory.value = task.category;
        taskPriority.value = task.priority;
        taskDueDate.value = task.dueDate || "";

        formTitle.textContent = "Edit Task";
        submitBtn.textContent = "Save Changes";
        cancelEditBtn.hidden = false;
        titleError.textContent = "";

        taskForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        taskTitle.focus();
    }

    // Delete a task
    function deleteTask(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        tasks = tasks.filter(function (task) {
            return task.id !== id;
        });

        if (editingId === id) {
            resetForm();
        }

        saveTasks();
        renderTasks();
    }

    // Mark a task completed or pending
    function toggleTask(id) {
        tasks = tasks.map(function (task) {
            if (task.id === id) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;
        });

        saveTasks();
        renderTasks();
    }

    // Create safe HTML elements without inserting task text as HTML
    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    // Build a task card
    function createTaskCard(task) {
        const card = createElement(
            "article",
            "task-item" + (task.completed ? " completed" : "")
        );

        const checkbox = createElement("input", "task-check");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.title + " as " +
                (task.completed ? "pending" : "completed")
        );

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        const details = createElement("div", "task-details");
        const title = createElement("p", "task-title", task.title);
        details.appendChild(title);

        const meta = createElement("div", "task-meta");

        meta.appendChild(createElement("span", "badge", task.category));

        const priorityClass = {
            High: "priority-high",
            Medium: "priority-medium",
            Low: "priority-low"
        }[task.priority] || "priority-medium";

        meta.appendChild(
            createElement(
                "span",
                "badge " + priorityClass,
                task.priority + " Priority"
            )
        );

        if (task.dueDate) {
            const due = createElement(
                "span",
                "due-date",
                "Due: " + task.dueDate
            );

            const today = new Date();
            const localToday = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0")
            ].join("-");

            if (!task.completed && task.dueDate < localToday) {
                due.classList.add("overdue");
                due.textContent += " (Overdue)";
            }

            meta.appendChild(due);
        }

        details.appendChild(meta);

        const actions = createElement("div", "task-actions");

        const editButton = createElement("button", "icon-btn", "✏️");
        editButton.type = "button";
        editButton.setAttribute("aria-label", "Edit " + task.title);
        editButton.title = "Edit task";
        editButton.addEventListener("click", function () {
            editTask(task.id);
        });

        const deleteButton = createElement(
            "button",
            "icon-btn delete-btn",
            "🗑️"
        );

        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", "Delete " + task.title);
        deleteButton.title = "Delete task";
        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(checkbox);
        card.appendChild(details);
        card.appendChild(actions);

        return card;
    }

    // Search, filter, and sort tasks
    function getVisibleTasks() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const status = filterStatus.value;
        const category = filterCategory.value;
        const sort = sortPriority.value;

        let visibleTasks = tasks.filter(function (task) {
            const matchesSearch =
                task.title.toLowerCase().includes(searchTerm) ||
                task.category.toLowerCase().includes(searchTerm) ||
                task.priority.toLowerCase().includes(searchTerm);

            const matchesStatus =
                status === "all" ||
                (status === "completed" && task.completed) ||
                (status === "pending" && !task.completed);

            const matchesCategory =
                category === "all" || task.category === category;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        if (sort === "priority") {
            const priorityOrder = {
                High: 3,
                Medium: 2,
                Low: 1
            };

            visibleTasks.sort(function (a, b) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        } else if (sort === "dueDate") {
            visibleTasks.sort(function (a, b) {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;

                return a.dueDate.localeCompare(b.dueDate);
            });
        }

        return visibleTasks;
    }

    // Update task cards and statistics
    function renderTasks() {
        totalCount.textContent = tasks.length;

        const completed = tasks.filter(function (task) {
            return task.completed;
        }).length;

        completedCount.textContent = completed;
        pendingCount.textContent = tasks.length - completed;

        taskList.replaceChildren();

        const visibleTasks = getVisibleTasks();

        visibleTasks.forEach(function (task) {
            taskList.appendChild(createTaskCard(task));
        });

        emptyState.hidden = visibleTasks.length > 0;

        if (tasks.length === 0) {
            emptyTitle.textContent = "No tasks yet";
            emptyMessage.textContent =
                "Add your first task to get started!";
        } else if (visibleTasks.length === 0) {
            emptyTitle.textContent = "No matching tasks";
            emptyMessage.textContent =
                "Try changing your search or filters.";
        }
    }

    // Refresh the task list when filters change
    searchInput.addEventListener("input", renderTasks);
    filterStatus.addEventListener("change", renderTasks);
    filterCategory.addEventListener("change", renderTasks);
    sortPriority.addEventListener("change", renderTasks);

    taskTitle.addEventListener("input", function () {
        titleError.textContent = "";
        taskTitle.style.borderColor = "";
    });

    // Initial display
    renderTasks();
});
