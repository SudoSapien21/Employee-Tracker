const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;


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

    const sql = 'SELECT id AS value, name FROM department';  

    db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      mainMenu();
    });
  }

// View all roles
function viewRoles() {
    const sql = 'SELECT id AS VALUE, title, salary, department_id, name FROM role';
    db.query(sql, (err, result, fields) => {
      if (err) {
        console.log('Error:', err);
      }
      console.table(result);
      mainMenu();
    });
  }


// View all employees
function viewEmployees() {
    const sql = 'SELECT id AS VALUE, first_name, last_name, role_id FROM employee';
    db.query(sql, (err, result, fields) => {
      if (err) {
        console.log('Error:', err);
        return;
      }
      console.table(result);
      mainMenu();
    });
  }
  

// Add a department
function addDepartment() { 
    inquirer.prompt([
      {
        name: "Department",
        type: "input",
        message: "Enter the name for the New Department:"
      },
    ]).then(answers => {
      console.log("Department Successfully Added:", answers);
    }).catch(error => {
      console.error("Error occurred:", error);
    }).then(() => {
      mainMenu(); 
    });
  }

// Add a role
app.post('/api/new-role', (req, res) => {
  const { title, salary, department_id } = req.body;
  const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  const params = [title, salary, department_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: { title, salary, department_id }
    });
  });
});

// Add an employee
app.post('/api/new-employee', (req, res) => {
  const { first_name, last_name, role_id, manager_id } = req.body;
  const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  const params = [first_name, last_name, role_id, manager_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: { first_name, last_name, role_id, manager_id }
    });
  });
});

// Update an employee role
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
        name: "department",
        type: "input",
        message: "Enter the department ID for the New Role:"
      },
    ]).then(answers => {
      console.log("Role Successfully Added:", answers);
      mainMenu(); 
    }).catch(error => {
      console.error("Error occurred:", error);
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
          displayOptions();
        });
      });
    });
  }
  
  
  
  app.listen(PORT, () => {
    console.log(`Running on (if working) ${PORT}`);
  });
  
  
  mainMenu();