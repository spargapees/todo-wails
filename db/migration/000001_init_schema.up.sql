CREATE TABLE "tasks" (
                         "id" bigserial PRIMARY KEY,
                         "title" varchar NOT NULL,
                         "description" varchar,
                         "done" bool NOT NULL DEFAULT (false),
                         "priority" varchar NOT NULL,
                         "created_at" timestamptz NOT NULL DEFAULT (now()),
                         "deadline" timestamptz
);
