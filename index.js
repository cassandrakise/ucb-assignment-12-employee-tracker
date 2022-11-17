const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
const fs = require("fs");
const hr = [];

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employee_db database.`)
);

function questions() {
  inquirer
    .prompt({
      name: "hr",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    })
    .then(function (answer) {
      if (answer.hr === "View All Employees") {
        displayAllEmployees();
      } else if (answer.hr === "Add Employee") {
        addEmployee();
      } else if (answer.hr === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.hr === "View All Roles") {
        viewAllRoles();
      } else if (answer.hr === "Add Role") {
        addRole();
      } else if (answer.hr === "View All Departments") {
        displayAllDepartments();
      } else if (answer.hr === "Add Department") {
        addDepartment();
      } else if (answer.hr === "Quit") {
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
      console.log({ error: err.message });
      return;
    }
    console.table(submission);
    questions();
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
          name: "first_name",
          type: "input",
          message: "What is your first name?",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is your last name?",
        },
        {
          name: "role_id",
          type: "list",
          message: "What is your role ID number?",
          choices: submission,
        },
        {
          name: "manager_id",
          type: "list",
          message: "Please select your manager ID number.",
          choices: [098, 876, 654, 432],
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO employee SET ?",
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
            console.log("Employee added!");
            questions();
          }
        );
      });
  });
}

// returns error :
// /Users/ckise/Desktop/CodingBootcamp/ucb-assignment-12-employee-tracker/index.js:184
//           id: data.id,
//               ^

// ReferenceError: data is not defined
//     at Query.onResult (/Users/ckise/Desktop/CodingBootcamp/ucb-assignment-12-employee-tracker/index.js:184:15) 

function updateEmployeeRole() {
  // needs 3 queries, 1) get roles, 2) get employees, 3) change role
  db.query(`SELECT * from employee`, (err, submission) => {
    if (err) {
      console.log(err);
    }
    submission = submission.map((employee) => {
      return {
        name: employee.first_name && employee.last_name,
        value: employee.id,
      };
    });
    db.query(
      `SELECT * FROM roles`,
      (err, options) => {
        if (err) {
          console.log(err);
        }
        options = options.map((roles) => {
          return {
            name: roles.title,
            value: roles.id,
          };
        });
        inquirer
          .prompt([
            {
              name: "employee_id",
              type: "list",
              message: "What is your name?",
              choices: submission,
            },
            {
              name: "role_id",
              type: "list",
              message: "What role should be on file?",
              choices: options,
            },
          ])
          .then((data) => {
            console.log(data)
            db.query(
              `UPDATE employee SET ? WHERE ?`,
              [
                {
                  role_id: data.role_id,
                },
                {
                  id: data.employee_id,
                },

              ],
              function (err) {
                if (err) {
                  console.log(
                    "No change to the selected employees role was made. Please resubmit if you would like to change the role of the employee."
                  );
                  console.log(err);
                }
              }
            );
            console.log("Selected role has been updated.");
            questions();
          });
      });
  });
    // const sql = `UPDATE role SET review = ? WHERE id = ?`; // needs to show user options to select which element to update, ie name, etc
}

function viewAllRoles() {
  const sql = `SELECT id, title FROM roles`;
  
  db.query(sql, (err, submission) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    console.table(submission);
    questions();
  })
};

function addRole() {
  const sql = `INSERT into roles SET ?`;
  db.query(
    `SELECT * FROM department`,
    (err, options) => {
      if (err) {
        console.log(err);
      }
      const departments = options.map((department) => {
        return {
          name: department.department_name,
          value: department.id,
        };
      });
      inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "Please provide a title of the new role",
        },
        {
          name: "departmentId",
          type: 'list',
          choices: departments
        }, // insert two more questions about role id and role salary
      ]).then((data) => {
          db.query(sql, data.roleName, (err, submission) => {
          if (err) {
          }
        })
    })
  })
}



function displayAllDepartments() {
  const sql = `SELECT id, department_name FROM department`;

  db.query(sql, (err, submission) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    console.table(submission);
    questions();
  });
}

function addDepartment() {
  // 1 prompt before the query to get the department name
  const sql = `SELECT * from department`;
  //  db.query(sql, (err, submission) => {
  //    if (err);
  //      submission = submission.map((department) => {
  //      return {
  //        name: department_name,
  //        value: department.id,
  //      },
  inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "Please enter the new department.",
      },
    ])
    .then((data) => {
      db.query(
        `INSERT INTO department SET ?`,
        {
          department_name: data.department_name,
        },
        (err) => {
          if (err) {
            console.log({ error: err.message });
            return;
          }
          console.log("New department added.");
          questions();
        }
      );
    });
}

function quitHr() {
  process.exit();
}

questions();
