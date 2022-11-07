const inquirer = require("inquirer");
const path = require("path");
// const generateProfile = require("./generateProfile");
const fs = require("fs");
const hr = [];

const PORT = process.env.PORT || 3001;
const app = express();

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "");

// const output = [];
const questions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "options",
    choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    // when needs to be inserted
  },
  {
    type: "input",
    message: "What is the name of the employee?",
    name: "addEmployee",
    when: (answers) => answers.add === "Add Employee",
  },
  {
    type: "input",
    message: "Which employee's role do you want to update?",
    name: "updateRole",
    when: (answers) => answers.update === "Update Employee Role",
  },
  {
    type: "input",
    message: "Which role do you want to assign the selected employee?",
    name: "reassignRole",
    when: (answers) => answers.reassign === "Update Employee Role",
  },

  {
    type: "input",
    message: "What is the name of the role?",
    name: "addRole",
    when: (answers) => answers.add === "Add Role",
  },
  {
    type: "input",
    message: "What is the name of the department?",
    name: "addDepartment",
    when: (answers) => answers.add === "Add Department",
  },
];

function promptUser() {
  inquirer
    .prompt(questions)
    .then((answers) => {
      console.log(answers)
      switch (answers.options) {
        case "View All Employees":
          // hr.push(
          //   new Manager(answers.name, answers.id, answers.email, answers.office)
          // );
          // break;

        case "Add Employee":
          inquirer
            .prompt()
          hr.push(
            new Employee (
              // answers.name,
              // answers.id,
              // answers.email,
              // answers.GitHub
            )
          );
          break;

        default:
          console.log("No such employee type.");
      }

      if (answers.addEmployee) {
        promptUser();
      } else {
        fs.writeFile(outputPath, (err) => {
          if (err) {
            throw err;
          }
          console.log("Success!");
        });
      }
    })
    .catch((err) => {
      if (err) {
        console.log("Error: ", err);
      }
    });
  }

promptUser();
