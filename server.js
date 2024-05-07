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
    // Use user feedback for... whatever!!
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

pool.connect();

app.listen(PORT, () => {
  console.log("Connected to port");
});
