SELECT employee.first_name, employee.last_name, role.title AS job_title, role.salary
FROM employee
LEFT JOIN role
ON employee.role_id = role.id
ORDER BY employee.last_name, employee.first_name;

