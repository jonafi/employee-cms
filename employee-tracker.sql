DROP DATABASE IF EXISTS employee_cms_db;
CREATE DATABASE employee_cms_db;
USE employee_cms_db;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
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
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(10),
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

INSERT INTO role(id, title, salary, department_id)
VALUES
  	(1, 'Intern', 30000, 5),
    (2, 'Associate', 40000, 1),
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
    (104, 'Steven', 'Spielberg', 4);
    
UPDATE employee
SET manager_id= 104
WHERE id<104;
    
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT employee.first_name, employee.last_name, role.title, department.name
FROM ((employee
INNER JOIN role ON employee.role_id = role.id)
INNER JOIN department ON role.department_id = department.id)
WHERE department.name = 'Engineering';









