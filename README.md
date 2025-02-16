# ToDo Application

A simple ToDo application built using Wails, React, and PostgreSQL. This app allows you to manage tasks with features like setting deadlines, priorities, and task status (Todo/Done).

## Features

- Add, edit, and delete tasks
- Set deadlines and priorities
- Toggle task status between Todo and Done
- User-friendly interface with color-coded task priorities

## Requirements

Before running the application, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Go](https://golang.org/dl/)
- [Node.js](https://nodejs.org/)
- [Wails](https://wails.io/)

## Setup Instructions

Follow the steps below to set up the application locally.

### 1. Clone the repository

Clone the repository to your local machine:

```bash
git clone https://github.com/spargapees/todo-wails.git
cd todo-wails
```
### 2. Set up PostgreSQL Docker container
Run the following command to start the PostgreSQL container:

```bash
make postgres
```
This will run a Docker container with the PostgreSQL database.

### 3. Apply Database Migrations
Run the following command to apply the migrations and set up the database schema:

```bash
make migrationup
```
### 4. Start the Application
After setting up the database, start the Wails application with the following command:

```bash
make wails
```
This will compile the application and open the interface in your default web browser.

Commands Overview

```bash 
make postgres
```
Starts the PostgreSQL Docker container.
```bash 
make migrationup
```
Applies database up migrations.
```bash 
make migrationdown
```
Applies database down migrations.
```bash 
make wails
```
Starts the Wails application.
```bash
make dropdb
```
Drops the PostgreSQL database.
```bash
make createdb
```
Creates the PostgreSQL database.

## Troubleshooting
If the database container is not running: You can start it manually with 
```bach
docker start todo-test-db
```
If the application fails to run: Ensure all dependencies (Go, Wails, Node.js, Docker) are installed correctly.
