package task

import "time"

type Task struct {
	id          int
	title       string
	description string
	done        bool
	priority    string
	createdAt   time.Time
	deadline    time.Time
}
