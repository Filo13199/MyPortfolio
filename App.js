const express =require('express')
const session = require('express-session');
const fs=require('fs')
const app=express()
const path=require('path')
const { check,validationResult } = require('express-validator')
const { sanitizeBody } = require('express-validator/')
var bodyParser=require('body-parser')

app.use(express.static('public'))
app.use(session({secret: 'ssshhhhh'}));
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(bodyParser.urlencoded({extended:false}))

app.listen(process.env.PORT || 8080 ,function(){
    console.log('Everything is fine :(')
})





app.get('/',function(req,res){
    sess=req.session
    res.redirect('/home')
})

app.get('/home',function(req,res){
   
   
    sess=req.session
    res.render('home.ejs')
    console.log(req.session.username)


})


app.get('/projects',function(req,res){
    sess=req.session
    res.render('projects.ejs')
})

app.get('/test',function(req,res){
    sess=req.session
    res.render('test.ejs')
})