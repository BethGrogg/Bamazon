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
        head: ["Item ID", "Product Name", "Category", "Price", "Quantity", "Product Sales"],
        colWidths: [10,25,25,10,14,10]
    });
    for(var i = 0; i < res.length; i++){
        if (res[i].product_sales === null) {
            res[i].product_sales = 0;
        };
        displayTable.push(
            [res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales]
            );
    }
    console.log(displayTable.toString());
};



function addToInventory() {
    var question = [{
        type: 'input',
        name: 'product',
        message: "What item would you like to add inventory to (item_id)?"
    },
    {
        type: 'input',
        name: 'amount',
        message: "How many units of this item would you like to add?"
    }

];


inquirer.prompt(question).then(answers => {



    connection.query("SELECT * FROM products WHERE item_id = ?", answers.product, function (err, res) {
        
        if (err) throw err;
    
            var queryString = "UPDATE products SET stock_quantity = stock_quantity +  " + answers.amount + " WHERE item_id = " + answers.product;
            
            connection.query(queryString, function (err, res) {
            if (err) throw err;
             console.log("Item " +answers.product+" has been updated!");
             connection.query("SELECT * FROM products WHERE item_id = ?", answers.product, function (err, res) {
        
                if (err) throw err;
             displayTable(res);
             });

        connection.end();
    });
});



});
};

function addNewProduct() {
    var question = [{
        type: 'input',
        name: 'product',
        message: "What item would you like to add?"
    },
    {
        type: 'input',
        name: 'department',
        message: "What department does this item belong in?"
    },
    {
        type: 'input',
        name: 'price',
        message: "How much does this item cost?"
    },
    {
        type: 'input',
        name: 'amount',
        message: "How many units of this item would you like to add?"
    }

];
inquirer.prompt(question).then(answers => {


    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answers.product + "', '" + answers.department + "', " + answers.price + ", " + answers.amount + ")", function (err, res) {
        
        if (err) throw err;
    
       
            connection.query("SELECT * FROM products", function (err, res) {
            displayTable(res);
            if (err) throw err;
            
            });
            
            connection.end();
       
    });
});
};