# Task Tracker

Task Tracker is a web application I created for Project Zed in WRIT 40363. I wanted to create something that could help me keep track of multiple projects/events, tasks, and deadlines all in one place. I am always looking for better ways to organize my daily work.

## MVP

In my app you can do the following:

- Add a project and project due date
- Add tasks to an active project
- Add a task due date
- Add optional details to a task
- See if a task is Past Due, Due Today, In Process, or Completed
- Mark a task complete or incomplete
- Delete a task
- Mark a project complete and reopen it if needed
- Keep projects and tasks saved after refreshing the page with localStorage

## Additional Features

As I continued working on the project, I added several features that went beyond my original MVP:

- Organize tasks under the project they belong to
- Use an active project dropdown when adding tasks
- Automatically move past due tasks to the top
- Move completed tasks to the bottom
- Edit projects and tasks
- Archive and restore projects
- Add optional notes to completed projects
- Delete an entire project from the Edit Project area
- Filter the dashboard by Active Projects, Past Due, Due Today, Completed, All Projects, and Archived Projects
- Export project and task information to a CSV file
- Use color coding to make task status easier to see
- Adjust the layout for smaller screens

## New Technique

My new technique was using JavaScript dates to compare and organize deadlines. I used dates to determine if a task is past due, due today, or still in process. I also used the dates to help organize the projects and tasks by deadline.

This helped me move beyond simply displaying information. The app now uses the task data to decide how items should be labeled, sorted, and displayed.

## Design

I also worked on the visual design throughout the project. I used color coding for task status and created a workspace-style layout that connects to the purpose of the app.

After feedback during my project walkthrough, I revised the desktop layout so the office graphic became part of the header instead of competing with the application. This created a clearer visual hierarchy and made the Task Tracker the main focus.

## Storage

Task Tracker uses localStorage to save projects and tasks in the browser. This means the data will still be there after the page is refreshed.

Because localStorage is browser-specific, the saved data does not automatically sync between different devices or browsers.