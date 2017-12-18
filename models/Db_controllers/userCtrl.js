//required for database connection
const mongoose = require("mongoose");
let User = mongoose.model("UserModel");



//function that returns a list of all users
module.exports.getAllUsers = function(){
	return new Promise((resolve,reject)=>{
		let users;

		//stores an array of all the documents in the User collection as an array
		User.find(function(err,userArray){
			if(err){
				console.log(err);
				reject(err);
			}
			resolve(userArray);
		});
	});
};


//returns user based on given id
module.exports.findUser = function(id){
	return new Promise((resolve,reject)=>{
		User.findOne({_id: id},function(err,foundUser){
		if(err){
			console.log("Could not find user based on id:" + id);
			console.log(err);
			reject(err);
		}
		resolve(foundUser);
		});
	});
};

// creates a user in the database, remember to change when implementing passport
module.exports.createUser = function(name,email,password){
	return new Promise((resolve,reject)=>{
		let newUser = new User();

		newUser.name = name;
		newUser.email = email;
		newUser.setPassword(password);

		newUser.save(function(err){
		if(err){
			console.log("could not save new user to database.");
			console.log(err);
			reject(err);
		}
		resolve(newUser);
		});
	});
};

