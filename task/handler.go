package task

import (
	"log"
)

type Handler struct {
	services Service
}

func (h *Handler) Add(task Task) error {
	_, err := h.services.Add(task)
	return err
}

func (h *Handler) GetAll() ([]Task, error) {
	tasks, err := h.services.GetAll()
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (h *Handler) GetAllDone() ([]Task, error) {
	tasks, err := h.services.GetAllDone()
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (h *Handler) GetAllTodo() ([]Task, error) {
	tasks, err := h.services.GetAllTodo()
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

/*
func (h *Handler) GetAll() (map[string]string, error) {
	return map[string]string{"message": "Hello, world!"}, nil

	tasks, err := h.services.GetAll()

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, tasks)

*/

func (h *Handler) Update(task Task) {
	err := h.services.Update(task)
	if err != nil {
		log.Print("update task failed")
	}
}

func (h *Handler) Delete(id int) {
	err := h.services.Delete(id)
	if err != nil {
		log.Print("delete task failed")
	}
}

func NewHandler(services Service) *Handler {
	if services == nil {
		log.Print("Service is nil")
	}
	return &Handler{services: services}
}
