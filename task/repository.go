package task

import (
	"database/sql"
	"fmt"
)

type Repository interface {
	Add(task Task) (Task, error)
	GetAll() ([]Task, error)
	Update(task Task) (Task, error)
	Delete(task Task) error
}

type repository struct {
	db *sql.DB
}

func (r *repository) Add(task Task) (Task, error) {
	var newTask Task
	query := "INSERT INTO tasks (title, description, priority, deadline) VALUES ($1, $2, $3, $4) RETURNING id, title, done"
	err := r.db.QueryRow(query, task.title, task.description, task.priority, task.deadline).Scan(&newTask.id, &newTask.title, &newTask.description, &newTask.done, &newTask.priority, &newTask.deadline)
	return newTask, err

}

func (r *repository) GetAll() ([]Task, error) {
	var tasks []Task
	query := "SELECT id, title, description, priority, deadline, done, created_at FROM tasks ORDER BY created_at DESC"
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var task Task
		err := rows.Scan(&task.id, &task.title, &task.description, &task.priority, &task.deadline, &task.done, &task.createdAt)

		if err != nil {
			return nil, err
		}

		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *repository) Update(task Task) (Task, error) {
	query := `
		UPDATE tasks 
		SET title = $1, description = $2, priority = $3, deadline = $4, done = $5
		WHERE id = $6
		RETURNING id, title, description, priority, deadline, done`
	var updatedTask Task
	err := r.db.QueryRow(
		query,
		task.title,
		task.description,
		task.priority,
		task.deadline,
		task.done,
		task.id,
	).Scan(
		&updatedTask.id,
		&updatedTask.title,
		&updatedTask.description,
		&updatedTask.priority,
		&updatedTask.deadline,
		&updatedTask.done,
	)
	if err != nil {
		return Task{}, err
	}

	return updatedTask, nil
}

func (r *repository) Delete(task Task) error {
	query := "DELETE FROM tasks WHERE id = $1"
	result, err := r.db.Exec(query, task.id)
	if err != nil {
		return err
	}

	// Optionally check if a row was actually deleted
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("no task found with ID %d", task.id)
	}

	return nil
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}
