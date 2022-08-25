//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


const app = new express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = {
    "email": String,
    "password": String
}

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
