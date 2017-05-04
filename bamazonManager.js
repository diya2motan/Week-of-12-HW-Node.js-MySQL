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

var productsTable = new Table({
    head: ['Prod ID', 'Product Name', 'Department', 'Price', 'Quantity'],
    colWidths: [10, 20, 20, 10, 10]

});

var lowInventoryTable = new Table({
    head: ['Prod ID', 'Product Name', 'Department', 'Price', 'Quantity'],
    colWidths: [10, 20, 20, 10, 10]

});

function lowInventory() {

    connection.query('SELECT * from products', function(error, results) {
        if (error) throw error;

        for (var i = 0; i < results.length; i++) {
            // console.log(results[i].stock_quantity);
            if (results[i].stock_quantity < 5) {
                lowInventoryTable.push(
                    [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
                );
            }
        }
        console.log(lowInventoryTable.toString());
    });
    connection.end();
};

function addInventory() {
    var newQuantity;
    inquirer.prompt([{
        type: 'input',
        name: 'id',
        message: "Enter Product ID: "
    }, {
        type: 'input',
        name: 'amount',
        message: "Enter amount to add: "

    }]).then(function(ans) {
        	// console.log(id, amount);
        	connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: ans.id }, function(error, results) {
            if (error) throw error
                // console.log(results[0].stock_quantity);
            newQuantity = parseInt(results[0].stock_quantity) + parseInt(ans.amount);
            console.log(newQuantity);
            connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuantity }, { item_id: ans.id }], function(error, res) {
                if (error) throw error
                    // console.log("hi");
            });
            connection.end();
        });
    });



};

function addNewProduct() {
    inquirer.prompt([{
        type: 'input',
        name: 'pname',
        message: "Enter Product Name: "
    }, {
        type: 'input',
        name: 'pdepart',
        message: "Enter Department: "

    }, {
        type: 'input',
        name: 'pprice',
        message: "Enter Price: "

    }, {
        type: 'input',
        name: 'pquantity',
        message: "Enter Quantity: "

    }]).then(function(answers) {

        connection.query("INSERT INTO products SET ?", {
            product_name: answers.pname,
            department_name: answers.pdepart,
            price: answers.pprice,
            stock_quantity: answers.pquantity
        }, function(err, res) {
            if (err) {
                throw err }
        });
        connection.end();
    });

};

function displayProducts() {
    connection.query('SELECT * from products', function(error, results) {
        if (error) throw error;

        for (var i = 0; i < results.length; i++) {

            productsTable.push(
                [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
        }
        console.log(productsTable.toString());
        // console.log(results);

    });
    connection.end();
};

inquirer.prompt([{
    type: "list",
    name: "decision",
    message: "What do you want to do? ",
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
}]).then(function(answers) {
    console.log(answers.decision);
    switch (answers.decision) {
        case 'View Products for Sale':
            displayProducts();
            break;
        case 'View Low Inventory':
            lowInventory();
            break;
        case 'Add to Inventory':
            addInventory();
            break;
        case 'Add New Product':
            addNewProduct();
            break;

    }


});
