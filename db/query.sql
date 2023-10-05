SELECT 
  e.id AS employee_id,
  e.first_name,
  e.last_name,
  r.title AS role,
  d.name AS department,
  r.salary,
  CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee AS e
LEFT JOIN roles AS r ON e.role_id = r.id -- Change "role" to "roles"
LEFT JOIN department AS d ON r.department_id = d.id
LEFT JOIN employee AS m ON e.manager_id = m.id
