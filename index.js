//Dependencies //////////////////////////////////
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const cTable = require('console.table');
// hiding my super secret password from evil TAs with a .gitignore
const hiddenPassword = require("./password.js")

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
        "View All Employees",
        "View Employees By Department",
        "View Employee Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "Exit"
      ]
    })
    .then(function (answer) {

      switch (answer.actionSelection) {
        case "View All Employees":
          displayEmployees();
          break;
        case "View Employees By Department":
          viewByDepartment();
          break;
        case "View Employee Manager":
          viewManager();
          break;
        case "Add Employee":
          addEmployee(); // static, change to prompt
          break;
        case "Remove Employee":
          removeEmployee(); // current
          break;
        case "Update Employee Role":
          console.log("update emp role function"); //UPDATE WHERE
          break;
        case "Update Employee Manager":
          console.log("update emp manager");  //UPDATE WHERE
          break;
        case "View All Roles":
          displayRoles();  //Done?
          break;
        case "Add Role":
          addRole();  //look at addEmployee
          break;
        case "Remove Role":
          removeRole();  //look at removeEmployee
          break;
        default:
          exitCheck();

      }


    });
}

function displayDepartments() {
  connection.query("SELECT * FROM department", function (err, data) {
    if (err) throw err;
    (console.table(" DEPARTMENTS ".inverse.brightGreen, data));
    selectAction();
  }
  );
}

function displayRoles() {
  connection.query("SELECT * FROM role", function (err, data) {
    if (err) throw err;
    console.table(" ROLES ".brightWhite.bgRed, data);
    selectAction();
  }
  );
}

function displayEmployees() {
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;

    console.table("\n EMPLOYEES ".white.bgBlue, data);
    selectAction();

  }
  );
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
      let queryText = `SELECT employee.first_name, employee.last_name, role.title, department.department_name
                        FROM ((employee INNER JOIN role ON employee.role_id = role.id)
                        INNER JOIN department ON role.department_id = department.id)
                        WHERE department.department_name = '${answer.departmentSelection}';`;

      connection.query(queryText, function (err, data) {
        if (err) throw err;
        console.table("\n", data);
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
            choiceArray.push(data[i].first_name + " " + data[i].last_name + " ID# " + data[i].manager_id);
          }
          return choiceArray;
        }
      }
    ])
    .then(function (answer) {
      let managerID= answer.employeeSelection.slice((answer.employeeSelection.indexOf("#") + 2), answer.employeeSelection.length)
      let queryText = `SELECT first_name, last_name FROM employee
      WHERE id = '${managerID}';`;

      connection.query(queryText, function (err, data) {
        if (err) throw err;
        console.table("\nManager Info:", data);
             selectAction();

      });
    }
    );

  });

}






// function displayAll() {
//   displayDepartments();
//   displayRoles();
//   displayEmployees();
// }


function addEmployee() {
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
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.employeeFirstName,
          last_name: answer.employeeLastName,

        },
        function (err) {
          if (err) throw err;
          console.log("\n\tEmployee Added!\n".green);
          selectAction();
        }
      );
    });
}

function removeEmployee() {
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;
    inquirer
      .prompt(
        {
          name: "employeeSelected",
          type: "rawlist",
          choices: function () {
            let choiceArray = [];

            for (let i = 0; i < data.length; i++) {
              choiceArray.push(data[i].first_name + " " + data[i].last_name + " ID# " + data[i].id);
            }
            return choiceArray;
          },
          message: "Select Employee to remove".red
        },
      )
      .then(function (data) {
        let idToDelete = data.employeeSelected.slice((data.employeeSelected.indexOf("#") + 2), data.employeeSelected.length)
        //console.log("write del query that uses:" + idToDelete);
        let deleteQuery = "DELETE FROM employee WHERE id=" + idToDelete;
        connection.query(deleteQuery, function (err) {
          if (err) {
            throw err;
          }
          console.log("\nEmployee Removed!\n".red);
          selectAction();
        }

        )

      }
      )
  }
  )
}

function addRole() {
  connection.query(
    "INSERT INTO role SET ?",
    {
      id: 11,
      title: "Partner",
      salary: 100000,
      department_id: 4
    },
    function (err) {
      if (err) throw err;
      console.log("\n\tRole Added!\n".green);
      selectAction();
    }
  );
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
