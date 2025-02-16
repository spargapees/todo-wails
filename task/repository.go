package task

import (
	"database/sql"
	"fmt"
	"log"
)

type Repository interface {
	Add(task Task) (Task, error)
	GetAll() ([]Task, error)
	Update(task Task) error
	Delete(id int) error
}

type repository struct {
	db *sql.DB
}

func (r *repository) Add(task Task) (Task, error) {
	var newTask Task
	query := "INSERT INTO tasks (title, description, priority, deadline) VALUES ($1, $2, $3, $4) RETURNING id, title, description, done, priority, deadline, created_at"
	err := r.db.QueryRow(query, task.Title, task.Description, task.Priority, task.Deadline).Scan(
		&newTask.Id,
		&newTask.Title,
		&newTask.Description,
		&newTask.Done,
		&newTask.Priority,
		&newTask.Deadline,
		&newTask.CreatedAt,
	)
	return newTask, err
}

func (r *repository) GetAll() ([]Task, error) {
	log.Print("Printing all tasks from getall func")
	var tasks []Task
	query := "SELECT id, title, description, priority, deadline, done, created_at FROM tasks ORDER BY created_at DESC"
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	log.Print("Query executed successfully")
	defer rows.Close()

	for rows.Next() {
		var task Task
		err := rows.Scan(&task.Id, &task.Title, &task.Description, &task.Priority, &task.Deadline, &task.Done, &task.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		// Properly format the log message
		log.Printf("Each task: Title=%s, Description=%s", task.Title, task.Description)
		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error after iterating rows: %w", err)
	}

	return tasks, nil
}

func (r *repository) Update(task Task) error {
	query := `
		UPDATE tasks 
		SET title = $1, description = $2, priority = $3, deadline = $4, done = $5
		WHERE id = $6
		RETURNING id, title, description, priority, deadline, done`
	var updatedTask Task
	err := r.db.QueryRow(
		query,
		task.Title,
		task.Description,
		task.Priority,
		task.Deadline,
		task.Done,
		task.Id,
	).Scan(
		&updatedTask.Id,
		&updatedTask.Title,
		&updatedTask.Description,
		&updatedTask.Priority,
		&updatedTask.Deadline,
		&updatedTask.Done,
	)
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) Delete(id int) error {
	query := "DELETE FROM tasks WHERE id = $1"
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	// Optionally check if a row was actually deleted
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("no task found with ID %d", id)
	}

	return nil
}

func NewRepository(db *sql.DB) Repository {
	if db == nil {
		log.Print("Database connection is nil")
	}
	return &repository{db: db}
}
