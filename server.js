const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;

// Error handling function for database errors
function handleDatabaseError(error) {
  console.error('Database Error:', error);
}

// Error handling function for input validation errors
function handleInputError(error) {
  console.error('Input Error:', error);
}


// Middleware
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dolliecassie', // <----- ADD YOUR PASSWORD
  database: 'employee_db'
});


// Display Menu

function mainMenu() {
    inquirer
      .prompt([
        {
          type: 'list', 
          name: 'action', 
          message: 'What would you like to do?', 
          choices: [ 
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a new department',
            'Add a new role',
            'Add a new employee',
            'Update employee role',
            'Exit',
          ],
        },
      ])


      .then(({ action }) => {
        console.log(action);
        switch (action) {
          case 'View all departments': 
            viewDepartments();
            break;
          case 'View all roles':
            viewRoles();
            break;
          case 'View all employees':
            viewEmployees();
            break;
           case 'Add a new department':
            addDepartment();
           break;
          case 'Add a new role':
           addRole();
           break;
          case 'Add a new employee':
            addEmployee();
            break;
            // Added a case to update an exsisting employee role
          case 'Update employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            console.log('bye');
            break;
          
          default:
              console.log(`didnt work`);
        }
      });
  }

// View all departments
function viewDepartments() {
  const sql = 'SELECT * FROM department';

  db.query(sql, (err, result) => {
    if (err) {
      console.table('Error:', err);
    } else {
      console.table(result);
    }
    mainMenu();
  });
}

// View all roles
function viewRoles() {
  const sql = `
    SELECT roles.title, roles.id, department.name AS department_name, roles.salary
    FROM roles
    JOIN department ON roles.department_id = department.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.table(result);
    }
    mainMenu();
  });
}

// View all employees
function viewEmployees() {
  const sql = `
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
`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.table(result);
    }
    mainMenu();
  });
}
  

// Add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Enter the name for the new department:",
      },
    ])
    .then((answers) => {
      const { name } = answers;
      const sql = "INSERT INTO department (id, name) VALUES (NULL, ?)";
      db.query(sql, [name], (err) => {
        if (err) {
          console.error("Error occurred:", err);
        } else {
          console.log("Department Successfully Added:", answers);
        }
        mainMenu();
      });
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      mainMenu();
    });
}


// Add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Enter the title for the new role:",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the salary for the new role:",
      },
      {
        name: "department_id",
        type: "input",
        message: "Enter the department ID for the new role:",
      },
    ])
    .then((answers) => {
      const { title, salary, department_id } = answers;
      const sql = "INSERT INTO roles (id, title, salary, department_id) VALUES (NULL, ?)";
      db.query(sql, [title, salary, department_id], (err) => {
        if (err) {
          console.error("Error occurred:", err);
        } else {
          console.log("Role Successfully Added:", answers);
        }
        mainMenu();
      });
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      mainMenu();
    });
}

// Add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "Enter the employee's first name:",
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter the employee's last name:",
      },
      {
        name: "role_id",
        type: "input",
        message: "Enter the employee's role ID:",
      },
      {
        name: "manager_id",
        type: "input",
        message: "Enter the employee's manager ID (or leave blank):",
      },
    ])
    .then((answers) => {
      const { first_name, last_name, role_id, manager_id } = answers;
      const sql =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      db.query(sql, [first_name, last_name, role_id, manager_id], (err) => {
        if (err) {
          handleDatabaseError(err);
        } else {
          console.log("Employee Successfully Added:", answers);
        }
        mainMenu();
      });
    })
    .catch((error) => {
      handleDatabaseError(err);
      mainMenu();
    });
}

// Add a role
function addRole() { 
  inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Enter the title for the New Role:"
    },
    {
      name: "salary",
      type: "input",
      message: "Enter the salary for the New Role:"
    },
    {
      name: "department_id",
      type: "input",
      message: "Enter the department ID for the New Role:"
    },
  ]).then(answers => {
    const { title, salary, department_id } = answers;

    // Define the SQL query for inserting a new role
    const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    
    // Define the parameters to be used in the SQL query
    const params = [title, salary, department_id];

    // Execute the SQL query to insert the new role
    db.query(sql, params, (err, result) => {
      if (err) {
        handleDatabaseError(err);
      } else {
        console.log("Role Successfully Added:", answers);
      }
      mainMenu();
    });
  }).catch(error => {
    handleInputError(error);
    mainMenu(); 
  });
}

  // Add a new employee
  function addEmployee() { 
    inquirer.prompt([
      {
        name: "firstname",
        type: "input",
        message: "Enter their first name:"
      },
      {
        name: "lastname",
        type: "input",
        message: "Enter their last name:"
      },
      {
        name: "role",
        type: "list",
        message: "What is their role?",
        choices: ["Engineering", "Finance", "Interconnected", "Legal"]
      },
    ]).then(answers => {
      console.log("Employee Sucessfully Added:", answers);
    }).catch(error => {
      console.error("Error occurred:", error);
      displayOptions();
    });
  }

  //update an employee role
  function getEmployeesList(callback) { 
    const sql = 'SELECT * FROM employee';
    db.query(sql, (err, employees) => {
      if (err) { //error checking
        console.error(err);
        callback([]);
      } else {
        callback(employees); 
      }
    });
  }


  function updateEmployeeRole() {
    
    getEmployeesList((employees) => { 
      const changeEmployee = employees.map((employee) => ({ 
        name: `${employee.first_name} ${employee.last_name}`,
     
        value: employee.id,
      }));
  
      inquirer.prompt([ 
        {
          name: "employeeId",
          type: "list",
          message: "Please pick the Employee you would like to change the role for:",
          choices: changeEmployee,
        },
        {
          name: "newRoleId",
          type: "input",
          message: "Enter the new role ID for the Employee:",
        },
      ]).then(answers => {
        const { employeeId, newRoleId } = answers; 
        const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
        db.query(sql, [newRoleId, employeeId], (err, result) => { 
          if (err) { 
            console.error(err);
          } else {
            console.log("Employee role updated successfully. DNACE LIKE A COW!");
          }
          mainMenu();
        });
      });
    });
  }
  
 

  
  app.listen(PORT, () => {
    console.log(`Running on (if working) ${PORT}`);
  });
  
  
  
  mainMenu();