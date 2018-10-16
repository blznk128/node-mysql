var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
  });

  var startApp = function(){
    connection.query("SELECT * FROM Products", function(err, result) {
        if (err) throw err;
        return (getItems(result));
      
      });
}
  var getItems = function (products){
    console.log("Welcome to my store!")
    console.log("Current items for sale!");
    for (var i = 0; i < products.length; i++) {
        var productsResults = "\n"+
        "ItemID: " + products[i].id+"\n"+
        "Item: " + products[i].product_name+"\n"+
        "Department: " + products[i].department_name+"\n"+
        "Price: $ "+ products[i].price+"\n"+
        "Quantity: " + products[i].stock_quantity + "\n--------------------";
        console.log(productsResults);
    }
}
startApp();