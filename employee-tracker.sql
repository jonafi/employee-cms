DROP DATABASE IF EXISTS employee_cms_db;
CREATE DATABASE employee_cms_db;
USE employee_cms_db;

CREATE TABLE department(
  id INTEGER PRIMARY KEY,
  name VARCHAR(30)
);

INSERT INTO department(id, name)
VALUES
  	(1, 'Accounting'),
    (2, 'IT'),
    (3, 'Marketing'),
    (4, 'Finance'),
    (5, 'Engineering');

CREATE TABLE role(
  id INTEGER PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(10),
  department_id INTEGER
);

INSERT INTO role(id, title, salary, department_id)
VALUES
  	(1, 'Intern', 30000, 5),
    (2, 'Associate', 40000, 1),
    (3, 'Manager', 50000, 3),
    (4, 'Director', 60000, 5),
    (5, 'Intern,', 32000, 5),
  	(6, 'Associate,', 42000, 3),
    (7, 'Associate', 44000, 5),
    (8, 'Manager', 55000, 2),
    (9, 'Director', 66000, 1),
    (10, 'Associate', 48000, 4);

CREATE TABLE employee(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER
);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
	(101, 'Bill', 'Dentern', 1, 4),
    (102, 'Susan', 'Anasc', 2, 9 ),
    (103, 'Peter', 'Mando', 3, null),
    (104, 'Steven', 'Spielberg', 5, null);
    
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
