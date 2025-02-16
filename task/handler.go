package task

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
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

func (h *Handler) Update(c *gin.Context) {
	var input Task

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Update(input); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{"ok"})
}

func (h *Handler) Delete(id int) {
	h.services.Delete(id)
}

func NewHandler(services Service) *Handler {
	if services == nil {
		log.Print("Service is nil")
	}
	return &Handler{services: services}
}
