const depts = require("express").Router();
// const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
// const uuid = require("../helpers/uuid");

// GET Route for retrieving all departments
depts.get("/", (req, res) => {
  console.info(`${req.method} request received for departments`);
  
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


module.exports = depts;
