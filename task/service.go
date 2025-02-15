package task

type Service interface {
	Add(task Task) (Task, error)
	GetAll() ([]Task, error)
	Update(task Task) (Task, error)
	Delete(task Task) error
}
type service struct {
	repos Repository
}

func (s service) Add(task Task) (Task, error) {
	return s.repos.Add(task)
}

func (s service) GetAll() ([]Task, error) {
	return s.repos.GetAll()
}

func (s service) Update(task Task) (Task, error) {
	return s.repos.Update(task)
}

func (s service) Delete(task Task) error {
	return s.repos.Delete(task)
}

func NewService(repos Repository) Service {
	return &service{
		repos: repos,
	}
}
