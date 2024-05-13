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
          console.log("Displaying all employees...");
          viewAllEmployees();
          break;
        case "Add Employee":
          console.log("Adding an employee...");
          addEmployee();
          break;
        case "Update Employee Role":
          console.log("Updating employee role...");
          updateEmployeeRole();
          break;
        case "View All Roles":
          console.log("Displaying all roles...");
          viewAllRoles();
          break;
        case "Add Role":
          console.log("Adding a role...");
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          console.log("Adding a department...");
          addDepartment();
          break;
        case "Quit":
          console.log("Exiting...");
          pool.end(); // Properly close the pool
          return; // Exit the function to stop the loop
      }
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


const viewAllEmployees = () => {
  const sql = `SELECT e.id,
    e.first_name,
    e.last_name,
    roles.title AS title,
    departments.name AS department,
    roles.salary AS salary,
    m.first_name || ' ' || m.last_name AS manager
    FROM employees e
    LEFT JOIN roles ON e.role_id = roles.id
    LEFT JOIN departments ON roles.department = departments.id
    LEFT JOIN employees m ON e.manager_id = m.id`;
  
  pool.query(sql, (err, res) => {
    if(err) {
      console.error('Error with query', err.stack);
      promptUser();
      return;
    }
    console.table(res.rows);
    promptUser();
  });
};

const addEmployee = async () => {
  let roles = await getRoleTitles();
  let managers = await getManagerTitles();
  
  inquirer.prompt([
    {
      type: 'input',
      name: 'employeeFirstName',
      message: "What is employee's first name?"
    },
    {
      type: 'input',
      name: 'employeeLastName',
      message: "What is employee's last name?"
    },
    {
      type: 'list',
      name: 'employeeRole',
      message: "What is employee's role?",
      choices: roles
    },
    {
      type: 'list',
      name: 'employeeManager',
      message: "Who is employee's manager?",
      choices: [...managers, { name: "None", value: null }]
    }
  ])
  .then((answers) => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
    console.log([answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager]);
    pool.query(sql, [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager], (err, res) => {
      if(err) {
        console.error('Error with query', err.stack);
        promptUser();
        return;
      }
      promptUser();
    });
  })
  .catch((error) => {
    console.error("Failed to add employee", error);
    promptUser();
  });
}

const updateEmployeeRole = () => {

}

const viewAllRoles = () => {
  const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles 
  JOIN departments ON roles.department = departments.id`;
  
  pool.query(sql, (err, res) => {
    if(err) {
      console.error('Error with query', err.stack);
      promptUser();
      return;
    }
    console.table(res.rows);
    promptUser();
  });
}

const addRole = async () => {
  let departments = await getDepartments();
  inquirer.prompt([
    {
      type: 'input',
      name: 'roleName',
      message: "What is the name of the role?"
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: "What is the salary of the role?"
    },
    {
      type: 'list',
      name: 'roleDepartment',
      message: "Which department does the role belong to?",
      choices: departments
    }
  ])
  .then((answers) => {
    const sql = `INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)`;
    pool.query(sql, [answers.roleName, answers.roleSalary, answers.roleDepartment], (err, res) => {
      if(err) {
        console.error('Error with query', err.stack);
        promptUser();
        return;
      }
      console.log(`Added ${answers.roleName} to the database.`)
      promptUser();
    });
  })
  .catch((error) => {
    console.error('Failed to fetch departments:', error);
    promptUser();
  });
}


const viewDepartments = () => {
  const sql = `SELECT * FROM departments`;
  
  pool.query(sql, (err, res) => {
    if(err) {
      console.error('Error with query', err.stack);
      promptUser();
      return;
    }
    console.table(res.rows);
    promptUser();
  });
};

const addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: "What is the name of the department?"
    }
  ])
  .then((answers) => {
    const sql = `INSERT INTO departments (name) VALUES ($1)`;
    pool.query(sql, [answers.departmentName], (err, res) => {
      if(err) {
        console.error('Error with query', err.stack);
        promptUser();
        return;
      }
      console.log(`Added ${answers.departmentName} to the database.`)
      promptUser();
    });
  })
  .catch((error) => {
    console.error('Failed to fetch roles or managers:', error);
    promptUser();
  });
}

const getRoleTitles = async () => {
  try {
    const result = await pool.query('SELECT id, title FROM roles');
    const roles = result.rows.map(row => ({
      name: row.title,
      value: row.id
    }));
    return roles;
  } catch (err) {
    console.error('Error with query', err.stack);
    throw err; 
  }
};

const getManagerTitles = async () => {
  try {
    const result = await pool.query("SELECT id, first_name || ' ' || last_name AS manager_name FROM employees");
    const managers = result.rows.map(row => ({
      name: row.manager_name,
      value: row.id
    }));
    return managers;
  } catch (err) {
    console.error('Error with query', err.stack);
    throw err;
  }
};

const getDepartments = async () => {
  try {
    const result = await pool.query(`SELECT * FROM departments`);
    const depts = result.rows.map(row => ({
      name: row.name,
      value: row.id
    }));
    return depts;
  } catch (err) {
    console.error('Error with query', err.stack);
    throw err;
  }
};