USE employee_db;

-- Insert some departments
INSERT INTO department (id, name) 
VALUES (1, 'HR'),
       (2, 'Finance'),
       (3, 'Engineering'),
       (4, 'Marketing'),
       (5, 'PR Department'),
       (6, 'Logistics'),
       (7, 'Legal');

-- Insert some roles
INSERT INTO roles (id, title, salary, department_id) 
VALUES (1, 'HR Manager', 60000, 1),
       (2, 'Finance Analyst', 55000, 2),
       (3, 'Software Engineer', 80000, 3),
       (4, 'Operation Director', 95000, 4),
       (5, 'Safety Lead', 50000, 5),
       (6, 'Coding', 100000, 6),
       (7, 'Marketing', 95000, 7);

-- Insert some employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
VALUES (1, 'Clarence', 'Tolson', 1, 1),
       (2, 'Victor', 'Cruz', 2, 2),
       (3, 'Henry', 'Cavill', 3, 3),
       (4, 'Alicia', 'Keys', 4, 4),
       (5, 'Nicki', 'Minaj', 5, 5),
       (6, 'Cardi', 'B', 6, 6),
       (7, 'Shawn', 'Carter', 7, 7);
