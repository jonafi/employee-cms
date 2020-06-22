//Dependencies //////////////////////////////////
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const cTable = require('console.table');
const hiddenPassword = require("./password.js"); // hiding my super secret password from evil TAs with a .gitignore

// MySQL connection setup ///////////////////////
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: hiddenPassword,
  database: "employee_cms_db"
});

// connect to the mysql server and sql database, call the menu
connection.connect(function (err) {
  if (err) throw err;

  console.log(`
███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
█████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝
                                                                     
 ██████╗███╗   ███╗███████╗                                          
██╔════╝████╗ ████║██╔════╝                                          
██║     ██╔████╔██║███████╗                                          
██║     ██║╚██╔╝██║╚════██║                                          
╚██████╗██║ ╚═╝ ██║███████║                                          
 ╚═════╝╚═╝     ╚═╝╚══════╝                                                                                                              
  `.brightGreen);


  selectAction();
});

//Named Functions /////////////////////////////

function selectAction() {
  inquirer
    .prompt({
      name: "actionSelection",
      type: "list",
      message: "Please select an action",
      choices: [
        "View Employees",
        "View Departments",
        "View Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Remove Employee",
        "View Employees By Department",
        "View Employee Manager", 
        "View Department Budget Total",
        "Update Employee Role",  
        "Update Employee Manager", 
        "Remove Role",  
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.actionSelection) {
        case "View Employees":
          display("employee", " EMPLOYEES ");
          break;
        case "View Departments":
          display("department", " DEPARTMENTS ");
          break;
        case "View Roles":
          display("role", " ROLES ");
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "View Employees By Department":
          viewByDepartment();
          break;
        case "View Employee Manager":
          viewManager();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View Department Budget Total":
          viewDepartmentBudgetTotal();
          break;
        case "Remove Role":
          removeRole();
          break;
        default:
          exitCheck();
      }
    });
}

function display(tableName, displayName) {
  connection.query(`SELECT * FROM ${tableName}`, function (err, data) {
    if (err) throw err;
    console.table(`\n ${displayName}`.brightWhite.bgBlue, data);
    selectAction();
  });
}

function addEmployee() {
  let managerQuery = `SELECT * FROM employee`;
  let managerChoices = [];
  connection.query(managerQuery, function (err, data) {

    if (err) {
      throw err;
    }
    for (let i = 0; i < data.length; i++) {
      managerChoices.push(data[i].first_name + " " + data[i].last_name + " " + data[i].id);
    }
  }
  );

  let roleQuery = `SELECT * FROM role`;
  let roleChoices = [];
  connection.query(roleQuery, function (err, data) {

    if (err) {
      throw err;
    }
    for (let i = 0; i < data.length; i++) {
      roleChoices.push(data[i].title + " " + data[i].id);
    }
  }
  );


  inquirer
    .prompt([
      {
        name: "employeeFirstName",
        type: "input",
        message: "Enter Employee First Name",
      },
      {
        name: "employeeLastName",
        type: "input",
        message: "Enter Employee Last Name",
      },
      {
        name: "employeeRole",
        type: "list",
        message: "Enter Role",
        choices: roleChoices
      },
      {
        name: "employeeManager",
        type: "list",
        message: "Enter Employee Manager",
        choices: managerChoices
      },
    ])
    .then(function (answer) {
      let roleIdHack = answer.employeeRole.slice(answer.employeeRole.length - 1);
      let employeeIdHack = answer.employeeManager.slice(answer.employeeManager.length - 3);
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.employeeFirstName,
          last_name: answer.employeeLastName,
          role_id: roleIdHack,
          manager_id: employeeIdHack,
        },
        function (err) {
          if (err) throw err;
          console.log("\n\tEmployee Added!\n".green);
          selectAction();
        }
      );
    });
}

function addRole() {



  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "Enter Role Name"
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Salary"
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.roleName,
          salary: answer.roleSalary,

        },
        function (err) {
          if (err) throw err;
          console.log("\n\tRole Added!\n".green);
          selectAction();
        }
      );
    });
    
 
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter Department Name"
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.departmentName,

        },
        function (err) {
          if (err) throw err;
          console.log("\n\tDepartment Added!\n".green);
          selectAction();
        }
      );
    });
}

function viewByDepartment() {
  connection.query("SELECT department_name FROM department", function (err, data) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "departmentSelection",
          type: "list",
          message: "Select a department",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < data.length; i++) {
              choiceArray.push(data[i].department_name);
            }
            return choiceArray;
          }
        }
      ])
      .then(function (answer) {
        let queryText = `SELECT * FROM (
                        (employee INNER JOIN role ON employee.role_id = role.id)
                        INNER JOIN department ON role.department_id = department.id)
                        WHERE department.department_name = '${answer.departmentSelection}';`;
        connection.query(queryText, function (err, data) {
          if (err) throw err;
          console.table("\n Department View ".white.bgGreen, data);
          selectAction();
        });
      }
      );
  });
}

function viewManager() {
  connection.query("SELECT first_name, last_name, manager_id FROM employee", function (err, data) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeeSelection",
          type: "list",
          message: "Select an Underling",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < data.length; i++) {
              choiceArray.push(data[i].first_name + " " + data[i].last_name + " ID # " + data[i].manager_id);
            }
            return choiceArray;
          }
        }
      ])
      .then(function (answer) {
        let managerID = answer.employeeSelection.slice((answer.employeeSelection.indexOf("#") + 2), answer.employeeSelection.length)
        let queryText = `SELECT first_name, last_name FROM employee
                         WHERE id = '${managerID}';`;
        connection.query(queryText, function (err, data) {
          console.log(typeof data);
          if (err) throw err;
          console.table("\n Manager ".white.bgBlue, data);
          selectAction();
        });
      }
      );
  });
}

function updateRole() {
  let employeeQuery = `SELECT * FROM employee`;
  let employeeChoices = [];
  connection.query(employeeQuery, function (err, data) {

    if (err) {
      throw err;
    }
    for (let i = 0; i < data.length; i++) {
      employeeChoices.push(data[i].first_name + " " + data[i].last_name + " " + data[i].id);
    }
  }
  );

  let roleQuery = `SELECT * FROM role`;
  let roleChoices = [];
  connection.query(roleQuery, function (err, data) {

    if (err) {
      throw err;
    }
    for (let i = 0; i < data.length; i++) {
      roleChoices.push(data[i].title + " " + data[i].id);
    }
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select Employee",
          choices: employeeChoices
        },
        {
          name: "newRole",
          type: "list",
          message: "Select New Role",
          choices: roleChoices
        },
      ])
      .then(function (answer) {
        let employeeIdHack = answer.employee.slice(answer.employee.length - 3);
        let newRoleHack = answer.newRole.slice(answer.newRole.length - 1);
        updateQuery = `UPDATE employee SET role_id = ${newRoleHack} WHERE id = ${employeeIdHack};`


        connection.query(updateQuery, function (err) {
          if (err) throw err;
          console.log("\n\tRole Updated!\n".green);
          selectAction();
        }
        );

      }
      );
  }
  );
}

function removeRole() {
  connection.query("SELECT * FROM role", function (err, data) {
    if (err) throw err;
    inquirer
      .prompt(
        {
          name: "roleSelected",
          type: "rawlist",
          choices: listRoleChoices(data),
          message: "Select role to remove".red
        },
      )
      .then(function (data) {
        let idToDelete = data.roleSelected.slice((data.roleSelected.indexOf("#") + 2), data.roleSelected.length)
        let deleteQuery = "DELETE FROM role WHERE id=" + idToDelete;
        connection.query(deleteQuery, function (err) {
          if (err) {
            throw err;
          }
          console.log("\nRole Removed!\n".red);
          selectAction();
        }
        )
      }
      )
  }
  )
}

function removeEmployee() {
  let employeeQuery = `SELECT * FROM employee`;
  let employeeChoices = [];
  connection.query(employeeQuery, function (err, data) {

    if (err) {
      throw err;
    }
    for (let i = 0; i < data.length; i++) {
      employeeChoices.push(data[i].first_name + " " + data[i].last_name + " " + data[i].id);
    }


    inquirer
      .prompt(
        {
          name: "employeeSelected",
          type: "list",
          message: "Enter Employee to remove",
          choices: employeeChoices
        }
      )
      .then(function (answer) {
        let idToDelete = answer.employeeSelected.slice(answer.employeeSelected.length - 3);
        let deleteQuery = `DELETE FROM employee WHERE id=${idToDelete}`;
        connection.query(deleteQuery, function (err) {


          if (err) {
            //throw err;
            if (err.errno == 1451) {
              console.log("\nCan not remove employee listed as someone's manager!\n".red)
            }
          }

          if (!err) console.log("\nEmployee Removed!\n".red);
          selectAction();
        });
      });
  }
  );
}


function viewDepartmentBudgetTotal() {
  connection.query("SELECT * FROM department", function (err, data) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "departmentSelection",
          type: "list",
          message: "Select a department",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < data.length; i++) {
              choiceArray.push(data[i].department_name + " ID # " + data[i].id);
            }
            return choiceArray;
          }
        }
      ])
      .then(function (answer) {
        
        let departmentIdSelected = answer.departmentSelection.slice(answer.departmentSelection.length -1)
        let queryText = `SELECT SUM(salary) FROM role WHERE id = ${departmentIdSelected};`;
        connection.query(queryText, function (err, data) {
          if (err) throw err;
          console.table("\n Department Budget Total ".white.bgGreen, data);
          selectAction();
        });
      }
      );
  });
}


function exitCheck() {
  inquirer
    .prompt({
      name: "exitConfirm",
      type: "confirm",
      message: "Are you sure you want to exit?".yellow,
    })
    .then(function (answer) {
      if (answer.exitConfirm == true) {
        connection.end();
      }
      else {
        selectAction();
      }
    });
}

