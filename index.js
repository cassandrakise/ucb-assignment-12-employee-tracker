const inquirer = require("inquirer");
const mysql = require('mysql2');
require('dotenv').config(); 
const fs = require("fs");
const hr = [];

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employee_db database.`)
);

function questions() {
  inquirer
    .prompt({
      name: 'hr',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Quit',
      ],
    })
    .then(function (answer){
      if (answer.hr === 'View All Employees') {
        displayAllEmployees();
      } else if (answer.hr === 'Add Employee') {
        addEmployee();
      } else if (answer.hr === 'Update Employee Role') {
        updateEmployeeRole();
      } else if (answer.hr === 'View All Roles') {
        viewAllRoles();
      } else if (answer.hr === 'Add Role') {
        addRole();
      } else if (answer.hr === 'View All Departments') {
        viewAllDepartments();
      } else if (answer.hr === 'Add Department') {
        addDepartment();
      } else if (answer.hr === 'Quit') {
        quitHr();
      }
    });
}

function displayAllEmployees() {
    const sql = `SELECT employee.first_name, employee.last_name, department.department_name, roles.title, roles.salary,employee.role_id, employee.manager_id
    FROM employee
    LEFT JOIN roles
    ON employee.role_id=roles.id
    LEFT JOIN department
    ON roles.department_id=department.id
    LEFT JOIN employee manager 
    ON manager.id =employee.manager_id
    ORDER BY department.id;`;

    db.query(sql, (err, submission) => {
      if (err) {
        console.log({ error: err.message })
        return;
      }
        console.table(submission)
      questions()
   });
}

function addEmployee() {
  const sql = `SELECT * from roles`; // will need to mimic this to bring up info for update
  db.query(sql, (err, submission) => {
    if (err);
    submission = submission.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    inquirer // this as well to update selected info
      .prompt([
        {
          name: 'first_name',
          type: 'input',
          message: 'What is your first name?',
        },
        {
          name: 'last_name',
          type: 'input',
          message: 'What is your last name?',
        },
        {
          name: 'role_id',
          type: 'list',
          message: 'What is your role ID number?',
          choices: submission,
        },
        {
          name: 'manager_id',
          type: 'list',
          message: 'Please select your manager ID number.',
          choices: [098, 876, 654, 432],
        },
      ])
    .then((data) => { 
      db.query(
        'INSERT INTO employee SET ?',
        {
          id: Math.floor(Math.random() * 1000),
          first_name: data.first_name,
          last_name: data.last_name,
          role_id: data.role_id,
          manager_id: data.manager_id,
        },
        (err, submission) => {
          if (err) { 
            console.log({ error: err.message });
            return;
          }
          console.table(submission)
        questions()
    });
  });
})
};

function updateEmployeeRole() { // needs 3 queries, 1) get roles, 2) get employees, 3) change role 
  const sql = `UPDATE role SET review = ? WHERE id = ?`; // needs to show user options to select which element to update, ie name, etc
  db.query(sql, (err, submission) => {
    if (err) {
      console.log({ error: err.message })
      return;
    }
      console.table(submission)
    questions()
  });
}

function viewAllDepartments() { // view 
  const sql = `SELECT id, department_id AS department FROM employee_db`

  db.query(sql, (err, submission) => {
    if (err) {
      console.log({ error: err.message })
      return;
    }
      console.table(submission)
      questions()

    });
}


function addDepartment() { 
 // 1 prompt before the query to get the department name
 const sql = `SELECT * from departments`;
 db.query(sql, (err, submission) => {
   if (err); 
     submission = submission.map((department) => {
     return {
       name: department_name,
       value: department.id,
     },
 inquirer
 .prompt([
   {
     name: 'department_name',
     type: 'input',
     message: 'Please enter the new department.'
    },
  ])
  .then((data) => {
    db.query(
      `INSERT INTO department SET ?`,
      {
        department_name: data.department_name,
      },
      (err, submission) => {
        if (err) {
          console.log({ error: err.message })
          return;
        }
        console.table(submission)
        questions()
    })
    // const department_name = data.department_name;
    // const sql = `INSERT INTO department (department_name) SET ?`;
    
    // const params = [department_name];  
    });
  });
});
}

function quitHr() {
    process.exit() 
  }

questions();