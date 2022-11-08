/*pulled from reference */

SELECT employee.first_name, employee.last_name, department.department_name, roles.title, roles.salary,employee.role_id, employee.manager_id
FROM employee
LEFT JOIN roles
ON employee.role_id=roles.id
LEFT JOIN department
ON roles.department_id=department.id
LEFT JOIN employee manager 
ON manager.id =employee.manager_id
ORDER BY department.id;

