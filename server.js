const express = require("express");
const inquirer = require("inquirer");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: "postgres",
  password: "bobcat",
  network: "localhost",
  database: "employees_db",
});

const asciiArt = `

_______________________________________________________________________________________________
|    ______                 _                         __  __                                   |
|   |  ____|               | |                       |  \\/  |                                  |
|   | |__   _ __ ___  _ __ | | ___  _   _  ___  ___  | \\  / | __ _ _ __   __ _  __ _  ___ _ __ |
|   |  __| | '_   _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\ | |\\/| |/ _  | '_ \\ / _  |/ _  |/ _ \\ '__||
|   | |____| | | | | | |_) | | (_) | |_| |  __/  __/ | |  | | (_| | | | | (_| | (_| |  __/ |   |
|   |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___| |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   |
|                    | |             __/ |                                      __/ |          |
|                    |_|            |___/                                      |___/           |
|______________________________________________________________________________________________|

`;

console.log(asciiArt);

function promptUser() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "action",
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
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "View All Employees":
          // Function to view all employees
          console.log("Displaying all employees...");

          break;
        case "Add Employee":
          // Function to add an employee
          console.log("Adding an employee...");
          break;
        case "Update Employee Role":
          // Function to update employee role
          console.log("Updating employee role...");
          break;
        case "View All Roles":
          // Function to view all roles
          console.log("Displaying all roles...");
          break;
        case "Add Role":
          // Function to add a role
          console.log("Adding a role...");
          break;
        case "View All Departments":
          viewDepartments();

          break;
        case "Add Department":
          // Function to add a department
          console.log("Adding a department...");
          break;
        case "Quit":
          console.log("Exiting...");
          pool.end(); // Properly close the pool
          return; // Exit the function to stop the loop
      }
      // Re-prompt the user after the action completes
      promptUser();
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldn't be rendered in the current environment");
      } else {
        console.log("An error occurred:", error);
      }
    });
}

promptUser();

pool.connect();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log("Connected to port");
});

const viewDepartments = () => {
  fetch;

  app.get("/departments", (req, res) => {
    const sql = `SELECT * FROM departments;`;

    pool.query(sql, (err, { rows }) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
      console.log(rows);
    });
  });
};
