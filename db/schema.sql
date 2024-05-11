DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

\c employees_db;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department INTEGER,
    FOREIGN KEY (department) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);


--View all departments:
SELECT * FROM departments;

-- View all roles:
SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles 
JOIN departments ON roles.department = departments.id;

--View all employees:
-- id, first name, last name, title, department, salary, manager
SELECT e.id AS employee_id,
e.first_name AS employee_first_name, 
e.last_name, 
roles.title AS role_id, 
departments.name AS department
FROM employees AS e
JOIN employees ON employees.manager_id


SELECT e.id,
       e.first_name,
       e.last_name,
       m.id,
       m.first_name,
       m.last_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id; -- each employee's manager_id is matched to another employee's id.
