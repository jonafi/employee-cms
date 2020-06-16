//Dependencies //////////////////////////////////

const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const cTable = require('console.table');
// hiding my super secret password (which is password123), from evil TAs with a .gitignore
const hiddenPassword = require("./password.js")

// MySQL connection setup ///////////////////////
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: hiddenPassword,
  database: "employee_cms_db"
});

// connect to the mysql server and sql database
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
  `.brightCyan);


  selectAction();
});

function selectAction() {
  inquirer
    .prompt({
      name: "actionSelection",
      type: "list",
      message: "Please select an action",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
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
          displayEmployees();  // Done?
          break;
        case "View All Employees By Department":
          console.log("view all emp. by dept. function"); // Sort? Join?
          break;
        case "View All Employees By Manager":
          console.log("view all emp. by manager function"); // Sort? Join?
          break;
        case "Add Employee":
          addEmployee(); // static, change to prompt
          break;
        case "Remove Employee":
          console.log("remove emp function"); // DEL WHERE 
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
    console.table(" EMPLOYEES ".white.bgBlue, data);
    selectAction();

  }
  );
}

function displayAll() {
  displayDepartments();
  displayRoles();
  displayEmployees();
}


function addEmployee() {
  connection.query(
    "INSERT INTO employee SET ?",
    {
      id: 105,
      first_name: "Tony",
      last_name:"Stark",
      role_id:5,
      manager_id:null
    },
    function (err) {
      if (err) throw err;
      console.log("Employee Added!");
      selectAction();
    }
  );
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
      console.log("Role Added!");
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

// // function to handle posting new items up for auction
// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid || 0,
//           highest_bid: answer.startingBid || 0
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }

// function bidAuction() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function(err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             let choiceArray = [];
//             for (let i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function(answer) {
//         // get the information of the chosen item
//         let chosenItem;
//         for (let i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
