let projects = [];
let tasks = [];

let currentFilter = "all";


const projectForm =
    document.getElementById("project-form");

const taskForm =
    document.getElementById("task-form");

const projectSelect =
    document.getElementById("project-select");

const taskList =
    document.getElementById("task-list");

const emptyMessage =
    document.getElementById("empty-message");

const filterMessage =
    document.getElementById("filter-message");

const projectsArea =
    document.getElementById("projects-area");


const projectsCount =
    document.getElementById("projects-count");

const overdueCount =
    document.getElementById("overdue-count");

const todayCount =
    document.getElementById("today-count");

const completedCount =
    document.getElementById("completed-count");


const summaryButtons =
    document.querySelectorAll(
        ".summary-card, .all-tasks-button"
    );



function addProject(event) {
    event.preventDefault();


    const projectName =
        document
            .getElementById("new-project-name")
            .value
            .trim();


    const projectDueDate =
        document
            .getElementById("new-project-due-date")
            .value;


    if (!projectName || !projectDueDate) {
        return;
    }


    let projectExists = false;


    projects.forEach(function(project) {

        if (
            project.projectName.toLowerCase() ===
            projectName.toLowerCase()
        ) {
            projectExists = true;
        }

    });


    if (projectExists) {
        alert("That project already exists.");
        return;
    }


    const project = {
        projectName: projectName,
        projectDueDate: projectDueDate,
        completed: false,
        notes: ""
    };


    projects.push(project);


    saveProjects();


    projectForm.reset();


    displayProjectOptions();
    displayTasks();
}



function addTask(event) {
    event.preventDefault();


    const projectName =
        projectSelect.value;


    const taskName =
        document
            .getElementById("task-name")
            .value
            .trim();


    const taskDetails =
        document
            .getElementById("task-details")
            .value
            .trim();


    const dueDate =
        document
            .getElementById("due-date")
            .value;


    if (!projectName || !taskName || !dueDate) {
        return;
    }


    const task = {
        projectName: projectName,
        taskName: taskName,
        details: taskDetails,
        dueDate: dueDate,
        completed: false
    };


    tasks.push(task);


    saveTasks();


    taskForm.reset();


    displayTasks();
}



function formatDate(dueDate) {
    const parts =
        dueDate.split("-");


    const date =
        new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}



function getMonthYear(dueDate) {
    const parts =
        dueDate.split("-");


    const date =
        new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric"
        }
    );
}



function getDeadlineStatus(dueDate) {
    const parts =
        dueDate.split("-");


    const taskDate =
        new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    if (taskDate < today) {
        return "Past Due";
    }


    if (
        taskDate.getTime() ===
        today.getTime()
    ) {
        return "Due Today";
    }


    return "In Process";
}



function getTaskMessage(status) {

    if (status === "Past Due") {
        return "Let's revisit this and see what needs to happen next.";
    }


    if (status === "Due Today") {
        return "This one needs your attention today. You've got this!";
    }


    if (status === "Completed") {
        return "Yay! Nice work. This one is done!";
    }


    return "You're making progress. Keep going!";
}



function getTaskPriority(task) {

    if (task.completed) {
        return 2;
    }


    const status =
        getDeadlineStatus(task.dueDate);


    if (status === "Past Due") {
        return 0;
    }


    return 1;
}



function displayProjectOptions() {

    projectSelect.innerHTML =
        '<option value="">Choose a project</option>';


    projects.forEach(function(project) {

        if (!project.completed) {

            projectSelect.innerHTML += `
                <option value="${project.projectName}">
                    ${project.projectName}
                </option>
            `;

        }

    });
}



function updateSummary() {
    let activeProjects = 0;
    let overdue = 0;
    let today = 0;
    let completed = 0;


    projects.forEach(function(project) {

        if (!project.completed) {
            activeProjects++;
        }

    });


    tasks.forEach(function(task) {

        if (task.completed) {
            completed++;
            return;
        }


        const status =
            getDeadlineStatus(task.dueDate);


        if (status === "Past Due") {
            overdue++;
        }


        if (status === "Due Today") {
            today++;
        }

    });


    projectsCount.textContent =
        activeProjects;

    overdueCount.textContent =
        overdue;

    todayCount.textContent =
        today;

    completedCount.textContent =
        completed;
}



function taskMatchesFilter(task) {

    const status =
        getDeadlineStatus(task.dueDate);


    if (currentFilter === "overdue") {

        return (
            !task.completed &&
            status === "Past Due"
        );

    }


    if (currentFilter === "today") {

        return (
            !task.completed &&
            status === "Due Today"
        );

    }


    if (currentFilter === "completed") {

        return task.completed;

    }


    return true;
}



function updateFilterButtons() {

    summaryButtons.forEach(function(button) {

        const isSelected =
            button.dataset.filter ===
            currentFilter;


        if (isSelected) {

            button.classList.add("selected");

            button.setAttribute(
                "aria-pressed",
                "true"
            );

        } else {

            button.classList.remove("selected");

            button.setAttribute(
                "aria-pressed",
                "false"
            );

        }

    });
}



function updateFilterMessage() {

    if (currentFilter === "all") {

        filterMessage.hidden = true;

        return;
    }


    filterMessage.hidden = false;


    if (currentFilter === "active") {

        filterMessage.textContent =
            "Showing active projects.";

    }


    if (currentFilter === "overdue") {

        filterMessage.textContent =
            "Showing past due tasks that need attention.";

    }


    if (currentFilter === "today") {

        filterMessage.textContent =
            "Showing tasks that are due today.";

    }


    if (currentFilter === "completed") {

        filterMessage.textContent =
            "Showing completed tasks.";

    }
}



function filterTasks(filter) {

    currentFilter =
        filter;


    displayTasks();


    projectsArea.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}



function toggleComplete(index) {

    tasks[index].completed =
        !tasks[index].completed;


    saveTasks();


    displayTasks();
}



function toggleProjectComplete(index) {

    projects[index].completed =
        !projects[index].completed;


    saveProjects();


    displayProjectOptions();
    displayTasks();
}



function toggleTaskDetails(index) {

    const details =
        document.getElementById(
            `task-details-${index}`
        );


    const button =
        document.getElementById(
            `details-button-${index}`
        );


    if (details.hidden) {

        details.hidden = false;

        button.textContent =
            "Hide Details";

    } else {

        details.hidden = true;

        button.textContent =
            "Details";

    }
}



function toggleProjectNotes(index) {

    const notesArea =
        document.getElementById(
            `project-notes-${index}`
        );


    const notesButton =
        document.getElementById(
            `project-notes-button-${index}`
        );


    if (notesArea.hidden) {

        notesArea.hidden = false;

        notesButton.textContent =
            "Hide Notes";

    } else {

        notesArea.hidden = true;

        notesButton.textContent =
            "Notes";

    }
}



function saveProjectNotes(index) {

    const notesInput =
        document.getElementById(
            `project-notes-input-${index}`
        );


    projects[index].notes =
        notesInput.value.trim();


    saveProjects();


    alert("Project notes saved.");
}



function deleteTask(index) {

    const task =
        tasks[index];


    const shouldDelete =
        confirm(
            `Delete "${task.taskName}"?`
        );


    if (shouldDelete) {

        tasks.splice(
            index,
            1
        );


        saveTasks();


        displayTasks();
    }
}



function displayTasks() {

    taskList.innerHTML = "";


    updateSummary();
    updateFilterButtons();
    updateFilterMessage();


    if (projects.length === 0) {

        emptyMessage.hidden = false;

        return;
    }


    emptyMessage.hidden = true;


    projects.sort(function(a, b) {

        return (
            new Date(a.projectDueDate) -
            new Date(b.projectDueDate)
        );

    });


    let currentMonth = "";

    let resultsFound = false;


    projects.forEach(function(
        project,
        projectIndex
    ) {


        let projectTasks =
            tasks
                .map(function(task, index) {

                    return {
                        task: task,
                        index: index
                    };

                })
                .filter(function(item) {

                    return (
                        item.task.projectName ===
                        project.projectName
                    );

                });


        if (
            currentFilter === "overdue" ||
            currentFilter === "today" ||
            currentFilter === "completed"
        ) {

            projectTasks =
                projectTasks.filter(
                    function(item) {

                        return taskMatchesFilter(
                            item.task
                        );

                    }
                );
        }


        let showProject = true;


        if (currentFilter === "active") {

            showProject =
                !project.completed;

        }


        if (
            currentFilter === "overdue" ||
            currentFilter === "today" ||
            currentFilter === "completed"
        ) {

            showProject =
                projectTasks.length > 0;

        }


        if (!showProject) {
            return;
        }


        resultsFound = true;


        projectTasks.sort(function(a, b) {

            const priorityA =
                getTaskPriority(a.task);


            const priorityB =
                getTaskPriority(b.task);


            if (priorityA !== priorityB) {

                return (
                    priorityA -
                    priorityB
                );

            }


            return (
                new Date(a.task.dueDate) -
                new Date(b.task.dueDate)
            );

        });


        const monthYear =
            getMonthYear(
                project.projectDueDate
            );


        if (monthYear !== currentMonth) {

            taskList.innerHTML += `
                <h2 class="month-heading">
                    ${monthYear}
                </h2>
            `;


            currentMonth =
                monthYear;
        }


        let projectStatus =
            "Active";


        if (project.completed) {

            projectStatus =
                "Completed";

        }


        let extraProjectClass = "";


        if (project.completed) {

            extraProjectClass +=
                " project-completed";

        }


        if (
            currentFilter === "completed"
        ) {

            extraProjectClass +=
                " show-completed-tasks";

        }


        let projectHTML = `
            <section
                class="project-section${extraProjectClass}"
            >

                <div class="project-heading">

                    <h3>
                        ${project.projectName}
                    </h3>

                    <p>
                        <strong>
                            Project Due:
                        </strong>

                        ${formatDate(
                            project.projectDueDate
                        )}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${projectStatus}
                    </p>

                    <button
                        type="button"
                        onclick="toggleProjectComplete(${projectIndex})"
                    >
                        ${project.completed
                            ? "Reopen Project"
                            : "Complete Project"}
                    </button>
        `;


        if (project.completed) {

            projectHTML += `
                <button
                    type="button"
                    id="project-notes-button-${projectIndex}"
                    onclick="toggleProjectNotes(${projectIndex})"
                >
                    Notes
                </button>


                <div
                    id="project-notes-${projectIndex}"
                    class="project-notes"
                    hidden
                >

                    <label
                        for="project-notes-input-${projectIndex}"
                    >
                        Project Notes
                    </label>


                    <textarea
                        id="project-notes-input-${projectIndex}"
                        rows="4"
                        placeholder="Add optional notes about this completed project..."
                    >${project.notes
                        ? project.notes
                        : ""}</textarea>


                    <button
                        type="button"
                        onclick="saveProjectNotes(${projectIndex})"
                    >
                        Save Notes
                    </button>

                </div>
            `;

        }


        projectHTML += `
                </div>

                <article class="project-card">

                    <div class="project-tasks">
        `;


        const projectHasTasks =
            projectTasks.length > 0;


        projectTasks.forEach(function(item) {

            const task =
                item.task;


            const index =
                item.index;


            let status =
                getDeadlineStatus(
                    task.dueDate
                );


            let statusClass =
                "task-in-process";


            let statusIcon =
                "→";


            if (status === "Past Due") {

                statusClass =
                    "task-overdue";

                statusIcon =
                    "!";

            }


            if (status === "Due Today") {

                statusClass =
                    "task-today";

                statusIcon =
                    "★";

            }


            if (task.completed) {

                status =
                    "Completed";

                statusClass =
                    "task-completed";

                statusIcon =
                    "✓";

            }


            projectHTML += `
                <section
                    class="task-item ${statusClass}"
                >

                    <p class="task-status">
                        ${statusIcon}
                        ${status}
                    </p>


                    <h4>
                        ${task.taskName}
                    </h4>


                    <p>
                        <strong>
                            Due:
                        </strong>

                        ${formatDate(
                            task.dueDate
                        )}
                    </p>


                    <p class="task-message">
                        ${getTaskMessage(
                            status
                        )}
                    </p>


                    <button
                        type="button"
                        id="details-button-${index}"
                        onclick="toggleTaskDetails(${index})"
                    >
                        Details
                    </button>


                    <button
                        type="button"
                        onclick="toggleComplete(${index})"
                    >
                        ${task.completed
                            ? "Mark Incomplete"
                            : "Mark Complete"}
                    </button>


                    <button
                        type="button"
                        onclick="deleteTask(${index})"
                    >
                        Delete
                    </button>


                    <div
                        id="task-details-${index}"
                        class="task-details"
                        hidden
                    >

                        <p>
                            <strong>
                                Details:
                            </strong>
                        </p>

                        <p>
                            ${task.details
                                ? task.details
                                : "No details have been added for this task."}
                        </p>

                    </div>

                </section>
            `;

        });


        if (!projectHasTasks) {

            projectHTML += `
                <p>
                    No tasks have been added
                    to this project yet.
                </p>
            `;

        }


        projectHTML += `
                    </div>

                </article>

            </section>
        `;


        taskList.innerHTML +=
            projectHTML;

    });


    if (
        !resultsFound &&
        currentFilter !== "all"
    ) {

        taskList.innerHTML = `
            <p class="no-filter-results">
                Nothing in this category right now.
            </p>
        `;

    }
}



function saveProjects() {

    try {

        localStorage.setItem(
            "projects",
            JSON.stringify(projects)
        );

    } catch (error) {

        alert(
            "Unable to save projects."
        );

    }
}



function loadProjects() {

    try {

        const saved =
            localStorage.getItem(
                "projects"
            );


        if (saved) {

            projects =
                JSON.parse(saved);

        } else {

            projects = [];

        }

    } catch (error) {

        projects = [];

    }
}



function saveTasks() {

    try {

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

    } catch (error) {

        alert(
            "Unable to save tasks."
        );

    }
}



function loadTasks() {

    try {

        const saved =
            localStorage.getItem(
                "tasks"
            );


        if (saved) {

            tasks =
                JSON.parse(saved);

        } else {

            tasks = [];

        }

    } catch (error) {

        tasks = [];

    }
}



projectForm.addEventListener(
    "submit",
    addProject
);


taskForm.addEventListener(
    "submit",
    addTask
);


summaryButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            filterTasks(
                button.dataset.filter
            );

        }
    );

});


loadProjects();
loadTasks();

displayProjectOptions();
displayTasks();