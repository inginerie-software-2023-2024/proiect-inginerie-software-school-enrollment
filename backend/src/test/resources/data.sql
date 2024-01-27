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

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (1010, false, false, true, null, 'profesor8@gmail.com', 'profesor8', 'aaaaa', 'profesor8', 'aaaa', 'profesor8');


INSERT INTO classes (id, max_number_of_students, school_id, teacher_id, name)
VALUES (1006, 10, 1, 1003, 'clasa1');

INSERT INTO classes (id, max_number_of_students, school_id, teacher_id, name)
VALUES (1007, 10, 2, 1004, 'clasa2');

INSERT INTO classes (id, max_number_of_students, school_id, teacher_id, name)
VALUES (1008, 10, 2, 1005, 'clasa3');



INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (2000, false, true, false, null, 'parinte1@gmail.com', 'parinte1', 'parinte1', 'parinte1', 'parinte1', 'parinte1');

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (2001, false, true, false, null, 'parinte2@gmail.com', 'parinte2', 'parinte2', 'parinte2', 'parinte2', 'parinte2');

INSERT INTO users (id, is_director, is_parent, is_teacher, school_id, email, first_name, hash, last_name, salt, username)
VALUES (2002, false, true, false, null, 'parinte3@gmail.com', 'parinte3', 'parinte3', 'parinte3', 'parinte3', 'parinte3');


INSERT INTO students (id, age, class_id, parent_id, school_id, cnp, first_name, last_name)
VALUES (2003, 10, null, 2000, 1, '1111111111111', 'student1', 'student1');

INSERT INTO students (id, age, class_id, parent_id, school_id, cnp, first_name, last_name)
VALUES (2004, 10, null, 2001, null, '2222222222222', 'student2', 'student2');

INSERT INTO students (id, age, class_id, parent_id, school_id, cnp, first_name, last_name)
VALUES (2005, 10, 1007, 2001, 2, '3333333333333', 'student3', 'student3');

INSERT INTO students (id, age, class_id, parent_id, school_id, cnp, first_name, last_name)
VALUES (2008, 10, null, 2002, null, '0000000000000', 'student5', 'student5');

INSERT INTO requests (id, school_id, student_id, status, grade)
VALUES (3001, 1, 2008, 'SENT', 10);