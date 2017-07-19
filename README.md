# Project Tracker

Project Tracker ([Live](http://projecttracker.dextersealy.com)) is a full-stack web application, modeled on [Pivotal Tracker](http://www.pivotaltracker.com),
that help agile teams keep in sync. It has a Ruby on Rails back-end (Postgresql)
and React/Redux front-end.

## Features

### Project, Stories and Tasks

Project Tracker consists of three major objects: projects, stories and tasks. A ***story*** is any intermediate project deliverable. It can be a new feature, a bug fix, a maintenance chore, or a release milestone. A ***project*** is a collection of stories that are worked on together by the project's members. Stories can have ***tasks*** that represent intermediate steps to be checked-off as they are completed.

The main application interface is a configurable, real-time project dashboard, where you can create and edit stories and track their progress through the development pipeline. The dashboard has four sections:

- Stories start off in an ***Icebox*** that holds anticipated deliverables
- When work commences on a deliverable, it moves to ***Current***
- When a deliverable is finished and accepted, it moves to ***Done***
- ***My Work*** lists the logged in user's current deliverables

Project Tracker pushes changes to logged in users and updates the dashboard in real-time to reflect the current status of all items.

## Back end

### Schema

User and session information are maintained by two tables:
- **users**: stores user profiles and password digests
- **sessions**: tracks active sessions and allows users to log in simultaneously from multiple locations

Information about stories, projects and tasks are stored in these tables:
- **stories**: this table contains a ```project_id``` column that associates stories with projects
- **tasks**: contains a similar ```story_id``` column linking tasks to stories
- **projects**: contains only the project title; there are no foreign keys
- **memberships**: this join table associates users with projects and their level of access (e.g., *owner*, *member* or *viewer*).

### Models

Each table has an associated ActiveRecord model that validates data before it gets persisted, and that removes dependent rows when the primary relation is deleted. **Of note:** the memberships model uses a scoped relation to identify "project owners" and "owned projects".

### Controllers

These controllers implement the RESTful interface between front and back-end components.

- **Users**: has a single action for creating new accounts.
- **Sessions**: has actions to create and destroy active sessions (i.e., log in/out).
- **Projects**: has CRUD (**C**reate, **R**ead, **U**pdate, and **D**elete) actions for projects.
- **Stories**: has CRUD actions for stories and, index and show actions that respectively return all the stories in a project, and all the data for one story (including its tasks). It also implements a custom ***prioritize*** action that the front-end invokes when you use drag & drop to reorder deliverables.
- **Tasks**: contains CRUD actions for tasks.

These controllers are internal plumbing:
- **StaticPages**: renders the root page that bootstraps the web application with the current user's identity
- **Pusher**: implements the authentication endpoint for [Pusher](https://pusher.com/) real-time notifications.

## Front end

### React Components

The application's entry point renders the ***Root*** component, who's sole purpose is to wrap the main App component within the store provider and hash router.

The ***App*** component defines these routes for the application:
Route | Purpose
---|---
 ```/signin```<br>```/login```<br>```/logout``` | manage user sessions
 ```/projects``` | create, edit and delete projects
 ```/project``` | the project dashboard
