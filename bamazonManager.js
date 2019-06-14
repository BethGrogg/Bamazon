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
              viewProducts();
              break;
          case ('View Low Inventory'):
              viewLowInventory();
              break;
          case ('Add to Inventory'):
              addToInventory();
              break;
          case ('Add New Product'):
              addNewProduct();
              break;
          default:
              console.log("not working");
              break;        
      }
    });

};

function viewProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
       
        if (err) throw err;
        
        displayTable(res);
        connection.end();


        });
};

function viewLowInventory() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {

        if (err) throw err;
        displayTable(res);
        connection.end();
    })
};

function displayTable(res) {
    var displayTable = new table ({
        head: ["Item ID", "Product Name", "Category", "Price", "Quantity"],
        colWidths: [10,25,25,10,14]
    });
    for(var i = 0; i < res.length; i++){
        displayTable.push(
            [res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
    }
    console.log(displayTable.toString());
};

function addToInventory() {


    connection.end();
};

function addNewProduct() {


    connection.end();
};