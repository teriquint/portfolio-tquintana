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

const dashboardFilters =
    document.querySelector(".dashboard-filters");

const exportButton =
    document.getElementById("export-csv");


const projectsCount =
    document.getElementById("projects-count");

const overdueCount =
    document.getElementById("overdue-count");

const todayCount =
    document.getElementById("today-count");

const completedCount =
    document.getElementById("completed-count");


const filterButtons =
    document.querySelectorAll(
        ".summary-card, .all-tasks-button, .archive-projects-button"
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


    const projectExists =
        projects.some(function(project) {

            return (
                project.projectName.toLowerCase() ===
                projectName.toLowerCase()
            );

        });


    if (projectExists) {

        alert(
            "That project already exists. Check your current or archived projects."
        );

        return;
    }


    const project = {
        projectName: projectName,
        projectDueDate: projectDueDate,
        completed: false,
        archived: false,
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



function getProjectForTask(task) {

    return projects.find(function(project) {

        return (
            project.projectName ===
            task.projectName
        );

    });
}



function displayProjectOptions() {

    projectSelect.innerHTML =
        '<option value="">Choose a project</option>';


    projects.forEach(function(project) {

        if (
            !project.completed &&
            !project.archived
        ) {

            projectSelect.innerHTML += `
                <option value="${project.projectName}">
                    ${project.projectName}
                </option>
            `;

        }

    });
}



/* DASHBOARD COUNTS */

function updateSummary() {

    let activeProjects = 0;
    let overdue = 0;
    let today = 0;
    let completedProjects = 0;


    projects.forEach(function(project) {

        if (project.archived) {
            return;
        }


        if (project.completed) {

            completedProjects++;

        } else {

            activeProjects++;

        }

    });


    tasks.forEach(function(task) {

        const project =
            getProjectForTask(task);


        if (
            !project ||
            project.archived ||
            project.completed ||
            task.completed
        ) {
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
        completedProjects;
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


    return true;
}



function updateFilterButtons() {

    filterButtons.forEach(function(button) {

        const isSelected =
            button.dataset.filter ===
            currentFilter;


        button.classList.toggle(
            "selected",
            isSelected
        );


        button.setAttribute(
            "aria-pressed",
            isSelected ? "true" : "false"
        );

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
            "Showing completed projects.";

    }


    if (currentFilter === "archived") {

        filterMessage.textContent =
            "Showing archived projects. Restore a project to return it to your workspace.";

    }
}



function filterTasks(filter) {

    currentFilter =
        filter;


    displayTasks();


    if (filter === "all") {

        dashboardFilters.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } else {

        projectsArea.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}



/* COMPLETE TASK */

function toggleComplete(index) {

    tasks[index].completed =
        !tasks[index].completed;


    saveTasks();


    displayTasks();
}



/* COMPLETE PROJECT */

function toggleProjectComplete(index) {

    projects[index].completed =
        !projects[index].completed;


    saveProjects();


    displayProjectOptions();
    displayTasks();
}



/* EDIT PROJECT */

function toggleProjectEdit(index) {

    const panel =
        document.getElementById(
            `project-edit-${index}`
        );


    panel.hidden =
        !panel.hidden;
}



function saveProjectEdit(index) {

    const oldName =
        projects[index].projectName;


    const newName =
        document
            .getElementById(
                `edit-project-name-${index}`
            )
            .value
            .trim();


    const newDate =
        document
            .getElementById(
                `edit-project-date-${index}`
            )
            .value;


    if (!newName || !newDate) {
        return;
    }


    const duplicate =
        projects.some(
            function(project, projectIndex) {

                return (
                    projectIndex !== index &&
                    project.projectName.toLowerCase() ===
                    newName.toLowerCase()
                );

            }
        );


    if (duplicate) {

        alert(
            "Another project already has that name."
        );

        return;
    }


    projects[index].projectName =
        newName;


    projects[index].projectDueDate =
        newDate;


    tasks.forEach(function(task) {

        if (task.projectName === oldName) {

            task.projectName =
                newName;

        }

    });


    saveProjects();
    saveTasks();


    displayProjectOptions();
    displayTasks();
}



/* EDIT TASK */

function toggleTaskEdit(index) {

    const panel =
        document.getElementById(
            `task-edit-${index}`
        );


    panel.hidden =
        !panel.hidden;
}



function saveTaskEdit(index) {

    const newName =
        document
            .getElementById(
                `edit-task-name-${index}`
            )
            .value
            .trim();


    const newDetails =
        document
            .getElementById(
                `edit-task-details-${index}`
            )
            .value
            .trim();


    const newDate =
        document
            .getElementById(
                `edit-task-date-${index}`
            )
            .value;


    if (!newName || !newDate) {
        return;
    }


    tasks[index].taskName =
        newName;


    tasks[index].details =
        newDetails;


    tasks[index].dueDate =
        newDate;


    saveTasks();


    displayTasks();
}



/* ARCHIVE */

function archiveProject(index) {

    const project =
        projects[index];


    const shouldArchive =
        confirm(
            `Archive "${project.projectName}"? You can restore it later from Archived Projects.`
        );


    if (!shouldArchive) {
        return;
    }


    projects[index].archived =
        true;


    saveProjects();


    displayProjectOptions();
    displayTasks();
}



function restoreProject(index) {

    projects[index].archived =
        false;


    saveProjects();


    displayProjectOptions();
    displayTasks();
}



/* TASK DETAILS */

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



/* PROJECT NOTES */

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


    alert(
        "Project notes saved."
    );
}



/* DELETE */

function deleteTask(index) {

    const task =
        tasks[index];


    const shouldDelete =
        confirm(
            `Delete "${task.taskName}"?`
        );


    if (!shouldDelete) {
        return;
    }


    tasks.splice(
        index,
        1
    );


    saveTasks();


    displayTasks();
}



/* DISPLAY */

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


        /*
            ARCHIVED PROJECTS ONLY SHOW
            IN ARCHIVED PROJECTS VIEW
        */

        if (currentFilter === "archived") {

            if (!project.archived) {
                return;
            }

        } else {

            if (project.archived) {
                return;
            }

        }


        /*
            GET ALL TASKS FOR THIS PROJECT
        */

        const allProjectTasks =
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


        let projectTasks =
            [...allProjectTasks];


        /*
            WHEN A PROJECT IS COMPLETED,
            HIDE TASKS THAT ARE ALREADY
            MARKED COMPLETED.

            REOPENING THE PROJECT MAKES
            THEM VISIBLE AGAIN.
        */

        if (project.completed) {

            projectTasks =
                projectTasks.filter(
                    function(item) {

                        return !item.task.completed;

                    }
                );

        }


        /*
            PAST DUE AND TODAY FILTER
            INDIVIDUAL TASKS
        */

        if (
            currentFilter === "overdue" ||
            currentFilter === "today"
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


        /*
            DECIDE WHICH PROJECTS SHOW
        */

        let showProject = true;


        if (currentFilter === "active") {

            showProject =
                !project.completed;

        }


        if (currentFilter === "completed") {

            showProject =
                project.completed;

        }


        if (
            currentFilter === "overdue" ||
            currentFilter === "today"
        ) {

            showProject =
                !project.completed &&
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


        if (project.archived) {

            projectStatus =
                "Archived";

        }


        let extraProjectClass = "";


        if (project.completed) {

            extraProjectClass +=
                " project-completed";

        }


        if (project.archived) {

            extraProjectClass +=
                " project-archived";

        }


        let projectHTML = `
            <section
                class="project-section${extraProjectClass}"
            >

                <div class="project-heading">

                    <div class="project-title-area">

                        <h3>
                            ${project.projectName}
                        </h3>

                        <p class="project-meta">
                            Project due
                            ${formatDate(
                                project.projectDueDate
                            )}
                        </p>

                        <span class="project-status">
                            ${projectStatus}
                        </span>

                    </div>


                    <div class="project-actions">
        `;


        if (currentFilter === "archived") {

            projectHTML += `
                        <button
                            type="button"
                            onclick="restoreProject(${projectIndex})"
                        >
                            Restore Project
                        </button>
            `;

        } else {

            projectHTML += `
                        <button
                            class="edit-button"
                            type="button"
                            onclick="toggleProjectEdit(${projectIndex})"
                        >
                            Edit Project
                        </button>


                        <button
                            type="button"
                            onclick="toggleProjectComplete(${projectIndex})"
                        >
                            ${project.completed
                                ? "Reopen Project"
                                : "Complete Project"}
                        </button>


                        <button
                            class="archive-project-button"
                            type="button"
                            onclick="archiveProject(${projectIndex})"
                        >
                            Archive Project
                        </button>
            `;

        }


        if (project.completed) {

            projectHTML += `
                        <button
                            type="button"
                            id="project-notes-button-${projectIndex}"
                            onclick="toggleProjectNotes(${projectIndex})"
                        >
                            Notes
                        </button>
            `;

        }


        projectHTML += `
                    </div>
        `;


        if (currentFilter !== "archived") {

            projectHTML += `
                    <div
                        class="edit-panel project-edit-panel"
                        id="project-edit-${projectIndex}"
                        hidden
                    >

                        <label
                            for="edit-project-name-${projectIndex}"
                        >
                            Project Name
                        </label>

                        <input
                            type="text"
                            id="edit-project-name-${projectIndex}"
                            value="${project.projectName}"
                        >


                        <label
                            for="edit-project-date-${projectIndex}"
                        >
                            Project Due Date
                        </label>

                        <input
                            type="date"
                            id="edit-project-date-${projectIndex}"
                            value="${project.projectDueDate}"
                        >


                        <div class="edit-actions">

                            <button
                                type="button"
                                onclick="saveProjectEdit(${projectIndex})"
                            >
                                Save Changes
                            </button>

                            <button
                                class="cancel-edit-button"
                                type="button"
                                onclick="toggleProjectEdit(${projectIndex})"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
            `;

        }


        if (project.completed) {

            projectHTML += `
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
                        >${project.notes || ""}</textarea>

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


        const projectHasVisibleTasks =
            projectTasks.length > 0;


        const hiddenCompletedTasks =
            allProjectTasks.filter(
                function(item) {

                    return item.task.completed;

                }
            ).length;


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
            `;


            if (currentFilter !== "archived") {

                projectHTML += `
                    <button
                        class="edit-button"
                        type="button"
                        onclick="toggleTaskEdit(${index})"
                    >
                        Edit
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
                        class="delete-button"
                        type="button"
                        onclick="deleteTask(${index})"
                    >
                        Delete
                    </button>
                `;

            }


            projectHTML += `
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
            `;


            if (currentFilter !== "archived") {

                projectHTML += `
                    <div
                        class="edit-panel task-edit-panel"
                        id="task-edit-${index}"
                        hidden
                    >

                        <label
                            for="edit-task-name-${index}"
                        >
                            Task Name
                        </label>

                        <input
                            type="text"
                            id="edit-task-name-${index}"
                            value="${task.taskName}"
                        >


                        <label
                            for="edit-task-details-${index}"
                        >
                            Task Details
                        </label>

                        <textarea
                            id="edit-task-details-${index}"
                            rows="3"
                        >${task.details || ""}</textarea>


                        <label
                            for="edit-task-date-${index}"
                        >
                            Task Due Date
                        </label>

                        <input
                            type="date"
                            id="edit-task-date-${index}"
                            value="${task.dueDate}"
                        >


                        <div class="edit-actions">

                            <button
                                type="button"
                                onclick="saveTaskEdit(${index})"
                            >
                                Save Changes
                            </button>

                            <button
                                class="cancel-edit-button"
                                type="button"
                                onclick="toggleTaskEdit(${index})"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                `;

            }


            projectHTML += `
                </section>
            `;

        });


        if (
            !projectHasVisibleTasks &&
            project.completed &&
            hiddenCompletedTasks > 0
        ) {

            projectHTML += `
                <p class="completed-project-message">
                    Completed tasks are hidden while this
                    project is completed. Reopen the project
                    to view them again.
                </p>
            `;

        } else if (!projectHasVisibleTasks) {

            projectHTML += `
                <p>
                    No tasks to show for this project.
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


    if (!resultsFound) {

        if (currentFilter === "archived") {

            taskList.innerHTML = `
                <p class="no-filter-results">
                    You do not have any archived projects yet.
                </p>
            `;

        } else if (currentFilter === "completed") {

            taskList.innerHTML = `
                <p class="no-filter-results">
                    You do not have any completed projects yet.
                </p>
            `;

        } else if (currentFilter === "all") {

            taskList.innerHTML = `
                <p class="no-filter-results">
                    No current projects to show.
                </p>
            `;

        } else {

            taskList.innerHTML = `
                <p class="no-filter-results">
                    Nothing in this category right now.
                </p>
            `;

        }

    }
}



/* CSV */

function escapeCSV(value) {

    if (
        value === null ||
        value === undefined
    ) {
        value = "";
    }


    const text =
        String(value)
            .replace(
                /"/g,
                '""'
            );


    return `"${text}"`;
}



function exportToCSV() {

    if (projects.length === 0) {

        alert(
            "There is no project data to export yet."
        );

        return;
    }


    const rows = [];


    rows.push([
        "Project",
        "Project Due Date",
        "Project Status",
        "Archived",
        "Project Notes",
        "Task",
        "Task Details",
        "Task Due Date",
        "Task Status",
        "Task Completed"
    ]);


    projects.forEach(function(project) {

        const projectTasks =
            tasks.filter(function(task) {

                return (
                    task.projectName ===
                    project.projectName
                );

            });


        let projectStatus =
            "Active";


        if (project.completed) {
            projectStatus = "Completed";
        }


        if (project.archived) {
            projectStatus = "Archived";
        }


        if (projectTasks.length === 0) {

            rows.push([
                project.projectName,
                project.projectDueDate,
                projectStatus,
                project.archived
                    ? "Yes"
                    : "No",
                project.notes || "",
                "",
                "",
                "",
                "",
                ""
            ]);

        } else {

            projectTasks.forEach(function(task) {

                let taskStatus =
                    getDeadlineStatus(
                        task.dueDate
                    );


                if (task.completed) {
                    taskStatus = "Completed";
                }


                rows.push([
                    project.projectName,
                    project.projectDueDate,
                    projectStatus,
                    project.archived
                        ? "Yes"
                        : "No",
                    project.notes || "",
                    task.taskName,
                    task.details || "",
                    task.dueDate,
                    taskStatus,
                    task.completed
                        ? "Yes"
                        : "No"
                ]);

            });

        }

    });


    const csvText =
        rows
            .map(function(row) {

                return row
                    .map(escapeCSV)
                    .join(",");

            })
            .join("\n");


    const blob =
        new Blob(
            [csvText],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    const today =
        new Date()
            .toISOString()
            .slice(0, 10);


    link.href =
        url;


    link.download =
        `task-tracker-export-${today}.csv`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);
}



/* LOCAL STORAGE */

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


            projects.forEach(function(project) {

                if (
                    project.archived ===
                    undefined
                ) {

                    project.archived =
                        false;

                }


                if (
                    project.notes ===
                    undefined
                ) {

                    project.notes =
                        "";

                }

            });

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



/* EVENTS */

projectForm.addEventListener(
    "submit",
    addProject
);


taskForm.addEventListener(
    "submit",
    addTask
);


filterButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            filterTasks(
                button.dataset.filter
            );

        }
    );

});


exportButton.addEventListener(
    "click",
    exportToCSV
);



/* START */

loadProjects();
loadTasks();

displayProjectOptions();
displayTasks();