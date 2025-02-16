import React, { useState, useEffect } from "react";
import { GetAll, Add, Delete, Update } from "../wailsjs/go/task/Handler";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            const result = await GetAll(); // Ensure this returns all tasks
            console.log("Fetched tasks:", result); // Log the fetched tasks
            setTasks(result); // Update the state
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async () => {
        if (!newTaskTitle || !newTaskDescription) {
            alert("All fields are required!");
            return;
        }

        const newTask = {
            title: newTaskTitle,
            description: newTaskDescription,
            done: false,
            priority: "medium",
            deadline: new Date().toISOString(),
        };

        try {
            console.log("Adding new task...");
            await Add(newTask);
            console.log("New task added successfully.");
            setNewTaskTitle("");
            setNewTaskDescription("");
            await new Promise((resolve) => setTimeout(resolve, 100)); // Optional delay
            await fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Delete a task
    const deleteTask = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this task?");
        if (!isConfirmed) return;
        try {
            await Delete(id);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Update a task's completion status
    const toggleTaskStatus = async (task) => {

        const newTask = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            deadline: task.deadline,
            id: task.id,
            done: !task.done,
        };

        try {
            await Update(newTask);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col">
                        <div className="card" style={{ borderRadius: ".75rem", backgroundColor: "#eff1f2" }}>
                            <div className="card-body py-4 px-4 px-md-5">
                                <p className="h1 text-center mt-3 mb-4 pb-3 text-primary">
                                    <u>My Todo-s</u>
                                </p>
                                <div className="pb-2">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row align-items-center">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg me-2"
                                                    placeholder="Task title..."
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg me-2"
                                                    placeholder="Task description..."
                                                    value={newTaskDescription}
                                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                                />
                                                <button className="btn btn-primary" onClick={addTask}>
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {tasks.map((task) => (
                                    <ul
                                        className="list-group list-group-horizontal rounded-0 bg-transparent mb-2"
                                        key={task.id}
                                    >
                                        <li className="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input me-0"
                                                    type="checkbox"
                                                    checked={task.done}
                                                    onChange={() => toggleTaskStatus(task)}
                                                />
                                            </div>
                                        </li>
                                        <li className="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                                            <p className={`lead fw-normal mb-0 ${task.done ? "text-decoration-line-through" : ""}`}>
                                                {task.title} - {task.description}
                                            </p>
                                        </li>
                                        <li className="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                                            <div className="d-flex flex-row justify-content-end mb-1">
                                                <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default App;
