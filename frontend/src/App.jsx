import React, { useState, useEffect } from "react";
import { GetAll, Add, Delete, Update, GetAllDone, GetAllTodo } from "../wailsjs/go/task/Handler";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState("medium");
    const [newTaskDeadline, setNewTaskDeadline] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");


    const fetchTasks = async () => {
        try {
            const result = await GetAll();
            setTasks(result);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };
    const fetchDoneTasks = async () => {
        try {
            const result = await GetAllDone();
            setTasks(result);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };
    const fetchTodoTasks = async () => {
        try {
            const result = await GetAllTodo();
            setTasks(result);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async () => {
        if (!newTaskTitle || !newTaskPriority || !newTaskDeadline) {
            alert("Title and Deadline fields are required!");
            return;
        }

        const newTask = {
            title: newTaskTitle,
            description: newTaskDescription,
            done: false,
            priority: newTaskPriority,
            deadline: new Date(newTaskDeadline).toISOString(),
        };

        try {
            await Add(newTask);
            setNewTaskTitle("");
            setNewTaskDescription("");
            setNewTaskPriority("medium");
            setNewTaskDeadline("");
            await fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

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

    const toggleTaskStatus = async (task) => {
        const newTask = { ...task, done: !task.done };
        try {
            await Update(newTask);

            if (activeFilter === "all") {
                fetchTasks();
            } else if (activeFilter === "done") {
                fetchDoneTasks();
            } else if (activeFilter === "todo") {
                fetchTodoTasks();
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };


    const openEditModal = (task) => {
        setTaskToEdit({ ...task });
        setEditModalOpen(true);
    };

    const handleEditChange = (field, value) => {
        if (field === "deadline") {
            const formattedValue = new Date(value).toISOString();
            setTaskToEdit((prev) => ({ ...prev, [field]: formattedValue }));
        } else {
            setTaskToEdit((prev) => ({ ...prev, [field]: value }));
        }
    };

    const saveTaskChanges = async () => {
        try {
            await Update(taskToEdit);
            setEditModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error("Error saving task changes:", error);
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
                                <div className="h1 text-center mt-3 mb-4 pb-3 text-success">
                                    <h1>My Todo</h1>
                                </div>
                                <div className="pb-2">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-column gap-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    placeholder="Task title..."
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                />
                                                <textarea
                                                    className="form-control form-control-lg"
                                                    placeholder="Task description..."
                                                    value={newTaskDescription}
                                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                                ></textarea>
                                                <select
                                                    className="form-select form-control-lg"
                                                    value={newTaskPriority}
                                                    onChange={(e) => setNewTaskPriority(e.target.value)}
                                                >
                                                    <option value="highest">Highest</option>
                                                    <option value="high">High</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="low">Low</option>
                                                    <option value="lowest">Lowest</option>
                                                </select>
                                                <input
                                                    type="datetime-local"
                                                    className="form-control form-control-lg"
                                                    value={newTaskDeadline}
                                                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                                                />
                                                <button className="btn btn-success" onClick={addTask}>
                                                    Add Task
                                                </button>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-3">
                                    <button
                                        className={`btn ${activeFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => {
                                            setActiveFilter("all");
                                            fetchTasks();
                                        }}
                                    >
                                        All Tasks
                                    </button>
                                    <button
                                        className={`btn ${activeFilter === "done" ? "btn-success" : "btn-outline-success"}`}
                                        onClick={() => {
                                            setActiveFilter("done");
                                            fetchDoneTasks();
                                        }}
                                    >
                                        Done
                                    </button>
                                    <button
                                        className={`btn ${activeFilter === "todo" ? "btn-warning" : "btn-outline-warning"}`}
                                        onClick={() => {
                                            setActiveFilter("todo");
                                            fetchTodoTasks();
                                        }}
                                    >
                                        Todo
                                    </button>
                                </div>

                                <hr className="my-4"/>

                                {tasks && tasks.length > 0 ? (tasks.map((task) => (
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
                                            <div className="d-flex align-items-center justify-content-between gap-2">
                                                {/* Priority Indicator */}
                                                <div
                                                    style={{
                                                        width: "10px",
                                                        height: "10px",
                                                        backgroundColor:
                                                            task.priority === "highest"
                                                                ? "red"
                                                                : task.priority === "high"
                                                                    ? "orange"
                                                                    : task.priority === "medium"
                                                                        ? "blue"
                                                                        : task.priority === "low"
                                                                            ? "lightblue"
                                                                            : "green",
                                                        borderRadius: "50%",
                                                    }}
                                                ></div>

                                                {/* Action Buttons */}
                                                <div className="d-flex flex-row justify-content-end gap-2">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => openEditModal(task)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => deleteTask(task.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </li>

                                    </ul>
                                ))) : (
                                <p>No Tasks available</p>
                                )}

                                {editModalOpen && (
                                    <div className="modal show d-block" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Edit Task</h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() => setEditModalOpen(false)}
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="mb-3">
                                                        <label className="form-label">Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={taskToEdit.title}
                                                            onChange={(e) => handleEditChange("title", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Description</label>
                                                        <textarea
                                                            className="form-control"
                                                            value={taskToEdit.description}
                                                            onChange={(e) => handleEditChange("description", e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Priority</label>
                                                        <select
                                                            className="form-select form-control-lg"
                                                            value={taskToEdit.priority} // Use taskToEdit.priority here
                                                            onChange={(e) => handleEditChange("priority", e.target.value)}
                                                        >
                                                            <option value="highest">Highest</option>
                                                            <option value="high">High</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="low">Low</option>
                                                            <option value="lowest">Lowest</option>
                                                        </select>

                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Deadline</label>
                                                        <input
                                                            type="datetime-local"
                                                            className="form-control"
                                                            value={new Date(taskToEdit.deadline).toISOString().slice(0, 16)}
                                                            onChange={(e) => handleEditChange("deadline", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => setEditModalOpen(false)}
                                                    >
                                                        Close
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={saveTaskChanges}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default App;
