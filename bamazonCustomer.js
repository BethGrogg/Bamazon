var inquirer = require("inquirer");
var mysql = require("mysql");

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
    returnProducts();
    
    
    
});


function returnProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
    
        
        customerBuy();
     //   connection.end();
    });
};

function customerBuy() {
  
    var question = [
        {
          type: 'input',
          name: 'product',
          message: "What item would you like to buy (input item_id)?"
        },
        {
          type: 'input',
          name: 'amount',
          message: "How many units of this item would you like to buy?"
        }
        
      ];
    
    
      inquirer.prompt(question).then(answers => {
        console.log("Answers: " + answers.product);
        console.log("Amount: " + answers.amount);
       
              

    connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", answers.product, function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
      });
    });
};