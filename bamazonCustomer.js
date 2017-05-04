var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');
var order = require('./order.js');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Bamazon'
});

connection.connect();

var productsTable = new Table({
        head: ['Prod ID', 'Product Name', 'Department', 'Price', 'Quantity'],
        colWidths: [10, 20, 20, 10, 10]

});

displayProducts();

function displayProducts(){
	connection.query('SELECT * from products', function(error, results) {
    if (error) throw error;

    

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    for (var i = 0; i < results.length; i++) {

        productsTable.push(
            [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
        );
    }
    console.log(productsTable.toString());
    // console.log(results);
    customerView();

    
});

}


 // order table
var orderTable = new Table({
    head: ['Prod ID', 'Product Name', 'Department', 'Price', 'Quantity'],
    colWidths: [10, 20, 20, 10, 10]

});


var customerView = function(){
	inquirer.prompt([{
    type: "input",
    name: "itemID",
    message: "Please enter the product ID for product you want to buy: "
}, {
    type: "input",
    name: "itmeQuantity",
    message: "Please enter the quantity: "
	// },{
	// 	type: "list",
 //    	name: "decision",
 //    	message: "Do you want to shop more? ",
 //    	choices: ['YES', 'NO']
	}]).then(function(answers) {

		// switch(answers.decision) {
		//     case "YES":

		//         //text = "Banana is good!";
		//         break;
		//     case "NO":
		//         //text = "I am not a fan of orange.";
		//         break;
		// }
		var id = parseInt(answers.itemID);
		var newQuantity;
	    connection.query('SELECT * from products where item_id = ?', [answers.itemID], function(error, results) {
	        if (error) throw error;
	        // console.log(results[0].stock_quantity);
	        if (results[0].stock_quantity > 0 && results[0].stock_quantity > answers.itmeQuantity) {
	            console.log("You are lucky, We have enough in store");

	            var custOrder = new order(results[0].item_id, results[0].product_name, results[0].department_name, results[0].price, answers.itmeQuantity);

	                orderTable.push(
	                    [custOrder.pid, custOrder.pname, custOrder.pdepartment, custOrder.pprice, custOrder.pquantity]
	                );

				newQuantity = results[0].stock_quantity - custOrder.pquantity;
				

	            console.log("\nYour Order:");
	            console.log(orderTable.toString());
	            var total = custOrder.pprice * custOrder.pquantity;
	            console.log("Your Total is: $", total);

	            updateTable(newQuantity,id);
	            connection.end();
	   
	        } else {
	            console.log("Insufficient quantity!");
	        }

	    });
	    
			
	    
	});

};

function updateTable(newQuantity, id){
	// connection.connect();
	// console.log(newQuantity, id);
	        connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: newQuantity},{item_id: id}], function(error,res){
				    	// console.log("hi");
	});
	        // connection.end();
}

// connection.end();

