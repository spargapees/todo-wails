package main

import (
	"context"
	"fmt"
	"todo-test/task"
)

// App struct
type App struct {
	ctx     context.Context
	handler *task.Handler
}

// NewApp creates a new App application struct
func NewApp(handler *task.Handler) *App {
	return &App{
		handler: handler,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
