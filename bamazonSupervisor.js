var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Bamazon'
});

connection.connect();

inquirer.prompt([{
    type: "list",
    name: "decision",
    message: "What do you want to do? ",
    choices: ['View Product Sales by department', 'Create New Department']
}]).then(function(answers) {
    console.log(answers.decision);
    switch (answers.decision) {
        case 'View Product Sales by department':
            viewSales();
            break;
        case 'Create New Department':
            createNewDepartment();
            break;

    }


});

function viewSales(){
	var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, departments.total_sales, products.product_sales ";
    query += "FROM departments INNER JOIN products ON (departments.department_name = products.department_name) ";
    
    var totalProfit;
	connection.query(query, function(err, res){
		if (err) throw err
		console.log(res);
	});
	connection.end();
};


function createNewDepartment(){
	inquirer.prompt([{
        type: 'input',
        name: 'dname',
        message: "Enter Department Name: "
    }, {
        type: 'input',
        name: 'dcosts',
        message: "Enter Over Head Costs: "
    }
    ]).then(function(answers) {

        connection.query("INSERT INTO departments SET ?", {
            department_name: answers.dname,
            over_head_costs: answers.dcosts,
            total_sales: 0
            
        }, function(err, res) {
            if (err) {
                throw err }
        });
        connection.end();
    });
}




