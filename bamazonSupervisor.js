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
          'View Product Sales by Department',
          'Create New Department'
          
        ]
      }
    ])
    .then(answers => {
      console.log(JSON.stringify(answers, null, '  '));

      switch (answers.toDo) {
          case ('View Product Sales by Department'):
              viewSalesByDept();
              break;
          case ('Create New Department'):
              createNewDept();
              break;
          default:
              console.log("not working");
              break;        
      }
    });

};

function viewSalesByDept() {

    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales) AS product_sales, product_sales - departments.over_head_costs AS total_profit FROM products JOIN departments USING (department_name) GROUP BY departments.department_name", function(err, res) {
      
        if (err) throw err;

        var displayTable = new table ({
            head: ["Department ID", "Department Name", "Over Head Costs", "Product Sales", "Total Profit"],
            colWidths: [10,25,25,10,14]
        });
        
        for(var i = 0; i < res.length; i++){
            if (res[i].product_sales === null) {
                res[i].product_sales = 0;
            };
            if (res[i].total_profit === null) {
                res[i].total_profit = 0;
            };
            
            
            displayTable.push(
                [res[i].department_id,res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]
                );
        }
        console.log(displayTable.toString());
        
    });


connection.end();


};

function createNewDept() {
    var question = [{
        type: 'input',
        name: 'department',
        message: "What department would you like to add?"
    },
    {
        type: 'input',
        name: 'amount',
        message: "What is the over head cost for this department?"
    }

];


inquirer.prompt(question).then(answers => {



    connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES ('" + answers.department + "', " + answers.amount + ")", function (err, res) {
        
        if (err) throw err;
        connection.query("SELECT * FROM departments", function (err, res) {
            if (err) throw err;
       
        var displayTable = new table ({
            head: ["Department ID", "Department Name", "Over Head Costs"],
            colWidths: [10,25,25]
        });
        
        for(var i = 0; i < res.length; i++){
           
            
            displayTable.push(
                [res[i].department_id,res[i].department_name, res[i].over_head_costs]
                );
        };
        console.log(displayTable.toString());
    });
        connection.end();
});

});
};