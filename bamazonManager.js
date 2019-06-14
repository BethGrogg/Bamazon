var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",

    password: "8FroCircu$",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    returnList();



});

function returnList() {
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'toDo',
        message: 'What would you like to do?',
        choices: [
          'View Products for Sale',
          'View Low Inventory',
          'Add to Inventory',
          'Add New Product'
        ]
      }
    ])
    .then(answers => {
      console.log(JSON.stringify(answers, null, '  '));

      switch (answers.toDo) {
          case ('View Products for Sale'):
          console.log("in 1");
          break;

          case ('View Low Inventory'):
              console.log("in 2");
              break;
          case ('Add to Inventory'):
              console.log("in 3");
              break;
          case ('Add New Product'):
              console.log("in 4");
              break;
          default:
              console.log("not working");
              break;        
      }
    });
connection.end();
};