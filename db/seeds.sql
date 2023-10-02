USE employee_db;

-- Insert some departments
INSERT INTO department (name) VALUES
  ('HR',),
  ('Finance'),
  ('Engineering'),
  ('Marketing'),
  ('PR Department'),
  ('Logistics'),
  ('Legal');

-- Insert some roles
INSERT INTO roles (title, salary, department_id) VALUES
  ('HR Manager', 60000, 1),
  ('Finance Analyst', 55000, 1),
  ('Software Engineer', 80000, 3),
  ('Marketing Specialist', 50000, 4);

-- Insert some employees
INSERT INTO employee (first_name, last_name, role_id) VALUES
   ('Clarence', 'Tolson', 1),
  ('John', 'Doe', 2),
  ('Jane', 'Smith', 3),
  ('Alice', 'Johnson', 4),
  ('Bob', 'Williams', 5),
  ( 'Prince', 3), 
  ('Dantin, Stone', 3);
