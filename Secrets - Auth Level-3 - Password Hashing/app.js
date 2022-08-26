//jshint esversion:6

// If someone is determined enough he can crack the key to our password, no matter where it is stored(.env,etc).
// So a more secure way would be the remove the key altogether.

// This is the main methodology behind hashing.
// There is no key, the password is directly converted to hash using hash function.

// Once converted to hash function it is almost impossible to convert hash back to password.

//PRO-TIP -- As the length of password increases the time the crack it goes up exponentially.



// done using md5 module.

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');


const app = new express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");


// We change the Schema defining a little bit
const userSchema = new mongoose.Schema( {
    "email": String,
    "password": String
})

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
    const password1 = md5(req.body.password);
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
    const password1 = md5(req.body.password);
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