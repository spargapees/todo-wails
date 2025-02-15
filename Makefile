postgres:
	docker run --name todo-test-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=todo-test -p 5432:5432 -d postgres

createdb:
	docker exec -it todo-test-db createdb --username=postgres --owner=postgres todo-test

dropdb:
	docker exec -it todo-test-db dropdb --username=postgres todo-test

migrateup:
	migrate -path db/migration -database "postgresql://postgres:secret@localhost:5432/todo-test?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migration -database "postgresql://postgres:secret@localhost:5432/todo-test?sslmode=disable" -verbose down

.PHONY: postgres createdb dropdb migrateup migratedown