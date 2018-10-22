var mysql = require("mysql");
var inquirer = require("inquirer");
var amountToPay;

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
    startApp();
    
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
    placeOrder();
}
var updatedItems = function(products){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
        return (getItems(res));
      
      });
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
function placeOrder(){
	inquirer.prompt([{
		name: 'selectId',
		message: 'Please enter the ID of the product you wish to purchase',
		validate: function(value){
			var valid = value.match(/[0-9]/)
			if(valid){
				return true
			}
				return 'Please enter a valid Product ID'
		}
	},{
		name:'selectQuantity',
		message: 'How many?',
		validate: function(value){
			var valid = value.match(/^[0-9]+$/)
			if(valid){
				return true
			}
				return 'Please enter a numerical value'
		}
	}]).then(function(answer){
	connection.query('SELECT * FROM products WHERE id = ?', [answer.selectId], function(err, res){
		if(answer.selectQuantity > res[0].stock_quantity){
			console.log('Insufficient quantity!');
			newOrder();
		}
		else{
			amountToPay = res[0].price * answer.selectQuantity;
			currentDepartment = res[0].department_name;
			console.log('Thank You');
			console.log('Your total is $' + amountToPay);
			console.log('');
			connection.query('UPDATE products SET ? Where ?', [{
				stock_quantity: res[0].stock_quantity - answer.selectQuantity
			},{
				id: answer.selectId
			}], function(err, res){});
			newOrder();
		}
	})

}, function(err, res){})
};

function newOrder(){
  inquirer.prompt([{
    type: "confirm",
    name: "reply",
    message: "Would you like to purchase another item?"
  }]).then(function(ans){
    if(ans.reply){
      updatedItems();
      placeOrder();
    } else{
      console.log("Have a pleasant day!");
      connection.end();
    }
  });
}