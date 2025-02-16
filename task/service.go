package task

import (
	"fmt"
	"log"
)

type Service interface {
	Add(task Task) (Task, error)
	GetAll() ([]Task, error)
	Update(task Task) error
	Delete(id int) error
	GetAllDone() ([]Task, error)
	GetAllTodo() ([]Task, error)
}
type service struct {
	repos Repository
}

func (s service) GetAllTodo() ([]Task, error) {
	log.Print(fmt.Sprintf("Getall done task"))
	return s.repos.GetAllTodo()
}

func (s service) GetAllDone() ([]Task, error) {
	log.Print(fmt.Sprintf("Getall todo task"))
	return s.repos.GetAllDone()
}

func (s service) Add(task Task) (Task, error) {
	log.Print(fmt.Sprintf("Add task"))

	return s.repos.Add(task)
}

func (s service) GetAll() ([]Task, error) {
	log.Print(fmt.Sprintf("Getall task"))
	return s.repos.GetAll()
}

func (s service) Update(task Task) error {
	log.Print(fmt.Sprintf("update task"))
	return s.repos.Update(task)
}

func (s service) Delete(id int) error {
	log.Print(fmt.Sprintf("delete task"))
	return s.repos.Delete(id)
}

func NewService(repos Repository) Service {
	if repos == nil {
		log.Print("Repository is nil")
	}
	return &service{
		repos: repos,
	}
}
