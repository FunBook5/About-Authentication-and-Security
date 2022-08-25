//jshint esversion:6

// We saw after level 1 that our password and username were unsecure as they were avaliable to anyone who had access to the database.
// Encryption is scrambling something so others don't know what message means unless they knew the process.

// First seen in Rome -- Caeser Cipher
// (cryptil.com)

// We will use mongoose-encryption which is an npm package.

require('dotenv').config;// we are not storing this in const because we won't be needing it.
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption'); // We have required mongoose-encryption


const app = new express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");


// We change the Schema defining a little bit
const userSchema = new mongoose.Schema( {
    "email": String,
    "password": String
})

//Now we had defined a key here, now its in env file.
//process.env.variableName is used to access this file.
userSchema.plugin(encrypt,{secret:process.env.KEY, encryptedFields:['password']});
//This plugin is to be added to the schema before creating the user model.

//Plugins are just extra bit of code that you can add to your schema to extend their functionality.

//mongoose auto encrpyts when we save in app.post register
//mongoose also auto decrypts for checking when we run find function in app.post login.

const User = mongoose.model("User",userSchema);

app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('home');
})

app.get('/register',function(req,res){
    res.render('register');
})

app.get('/login',function(req,res){
    res.render('login');
})

app.post('/register', function(req,res){
    const email1 = req.body.username;
    const password1 = req.body.password;
    // console.log(email);
    // console.log(password);

    const newUser = new User({
       email: email1,
       password : password1
    })

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    })   

})

app.post('/login', function(req,res){
    const email1 = req.body.username;
    const password1 = req.body.password;
    // console.log(email);
    // console.log(password);
    
    User.findOne({email:email1},function(err,foundUser){
        if(err){
            console.log(err);
        }
        if(foundUser){
            if(foundUser.password === password1){
                res.render("secrets");
            }
            else{
                res.render("Wrong-pass");
            }
        }
    })    

})


app.listen(3000,function(){
    console.log("Server is running on port 3000");
})



/////////////////////////.env/////////////////////////////
// Now though we have encrypted password in database, our encryption key is still in plain text above.
// For that we use environment variables. 

// The package we use for this is dotenv from npm packages.

//should be required right on top of the page and then we have to create a .env file.

// We will cut our key and place it in .env file.

/////////////////////////////////////////gitignore//////////////////////////////////////
// This file is hidden unless opened by ide, but when we upload it on github its gets exposed so the solution
// to that is .gitignore file.
// .gitignore file ignores not only env file but also node modules and other files which are not req in github.
// They have a template for all files, on github/gitignore just search it on google.