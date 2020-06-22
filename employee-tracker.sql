DROP DATABASE IF EXISTS employee_cms_db;
CREATE DATABASE employee_cms_db;
USE employee_cms_db;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30)
);

INSERT INTO department(id, department_name)
VALUES
  	(1, 'Accounting'),
    (2, 'IT'),
    (3, 'Marketing'),
    (4, 'Finance'),
    (5, 'Engineering');

CREATE TABLE role(
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(10),
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

INSERT INTO role(id, title, salary, department_id)
VALUES
  	(1, 'Intern', 30000, 3),
    (2, 'Associate', 40000, 3),
    (3, 'Manager', 50000, 3),
    (4, 'Director', 60000, 5);

CREATE TABLE employee(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER, 
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO employee(id, first_name, last_name, role_id)
VALUES
	(101, 'Bill', 'Dentern', 1),
    (102, 'Susan', 'Anasc' ,2),
    (103, 'Peter', 'Mando', 3),
    (104, 'Steven', 'Spielberg', 4),
    (105, 'Bobby', 'Ingsoll', 1); 
    

Update employee
SET manager_id = 103
WHERE id = 101;
Update employee
SET manager_id = 104
WHERE id = 103;
Update employee
SET manager_id = 104
WHERE id = 102;
    
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT employee.first_name, employee.last_name, role.title, department.department_name
FROM ((employee
INNER JOIN role ON employee.role_id = role.id)
INNER JOIN department ON role.department_id = department.id)
WHERE department.department_name = 'Engineering';

SELECT department_name FROM department;

SELECT first_name, last_name FROM employee
WHERE manager_id = 104;

UPDATE employee
SET role_id = 1
WHERE id=101; 

SELECT employee.first_name, employee.last_name, employee.id, employee.role_id, role.title
FROM (employee
INNER JOIN role ON employee.role_id = role.id);

/*UPDATE employee SET role_id = 3 WHERE id = 105;*/

SELECT SUM(salary) FROM role WHERE id = 3;

SELECT SUM(salary) FROM (employee INNER JOIN role ON employee.role_id = role.id) WHERE role.id=1;


