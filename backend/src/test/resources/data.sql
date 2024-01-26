INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (0, false, false, false, null, 'exista@gmail.com', 'primul', 'aaaaa', 'last_name_exista', 'aaaa', 'deja_exista');

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (1000, true, false, false, null, 'director1@gmail.com', 'director1', 'aaaaa', 'director1', 'aaaa', 'director1');

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (1001, true, false, false, null, 'director2@gmail.com', 'director2', 'aaaaa', 'director2', 'aaaa', 'director2');

INSERT INTO schools (id, principal_id, description, name)
VALUES (1, 1000, 'prima_scoala', 'prima_scoala');

INSERT INTO schools (id, principal_id, description, name)
VALUES (2, 1001, 'a_doua_scoala', 'a_doua_scoala');

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (1002, false, false, true, 2, 'profesor1@gmail.com', 'profesor1', 'aaaaa', 'profesor1', 'aaaa', 'profesor1');

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (1003, false, false, true, 1, 'profesor2@gmail.com', 'profesor2', 'aaaaa', 'profesor2', 'aaaa', 'profesor2');

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (1004, false, false, true, 2, 'profesor3@gmail.com', 'profesor3', 'aaaaa', 'profesor3', 'aaaa', 'profesor3');

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (1005, false, false, true, 2, 'profesor4@gmail.com', 'profesor4', 'aaaaa', 'profesor4', 'aaaa', 'profesor4');


INSERT INTO classes (id, max_number_of_students, school_id, teacher_id, name)
VALUES (1006, 10, 1, 1003, 'clasa1');

INSERT INTO classes (id, max_number_of_students, school_id, teacher_id, name)
VALUES (1007, 10, 2, 1004, 'clasa2');

INSERT INTO classes (id, max_number_of_students, school_id, teacher_id, name)
VALUES (1008, 10, 2, 1005, 'clasa3');