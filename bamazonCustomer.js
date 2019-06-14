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
    returnProducts();



});


function returnProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
       
        if (err) throw err;
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


        customerBuy();
        //   connection.end();
    });
};

function customerBuy() {

    var question = [{
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



        connection.query("SELECT * FROM products WHERE item_id = ?", answers.product, function (err, res) {
            
            if (err) throw err;
        
            if (answers.amount <= res[0].stock_quantity) {
                console.log("Good news! Your item is in stock!");
                var queryString = "UPDATE products SET stock_quantity = stock_quantity -  " + answers.amount + " WHERE item_id = " + answers.product;
                
                connection.query(queryString, function (err, res) {
                if (err) throw err;
                
                })
                var totalPrice = answers.amount * res[0].price;
                console.log("The cost of your purchase for " + answers.amount + " " + res[0].product_name+ " is " + totalPrice);
            } else {
                console.log("Sorry, insufficient stock at this time.")
            };

            connection.end();
        });
    });
};