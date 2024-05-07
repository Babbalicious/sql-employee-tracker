const express = require("express");
const inquirer = require("inquirer");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: "postgres",
  password: "bobcat",
  network: "localhost",
  database: "",
});

inquirer.prompt([
  {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [],
  },
]);

pool.connect();

app.listen(PORT, () => {
  console.log("Connected to port");
});
