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

let  Get_Array= function(){
    try{    let tasks1=fs.readFileSync('Users.json')
    var List=tasks1.toString()
    let Users1=JSON.parse(List)
    return Users1}

    catch(error){
        return [];
    }
}


let Update_File = function(user){
var Users1=Get_Array()
Users1.push(user)
fs.writeFileSync("Users.json",JSON.stringify(Users1))}


let CheckUnique=function(USERID2){
    var Users =Get_Array()
    var i=0
for(i=0;i<Users.length;i++){
    if(Users[i].UserID === USERID2){
        return false;
    }
} 
return true;
}

let CheckExists=function(USERID2,Pass){
    var Users =Get_Array()
    var i=0
for(i=0;i<Users.length;i++){
    if(Users[i].UserID === USERID2 && Users[i].PW===Pass){
        return i;
    }
} 
return -1;
}
let getIndex=function(USERID){
    var Users=Get_Array()
    var i=0
    for(i=0;i<Users.length;i++){
        if(Users[i].UserID === USERID)
        return i
    }
return -1}

var Users1=Get_Array()

var UIDs=[];
var i;
var empty=false;
var Unique1=true;
for(i=0;i<Users1.length;i++){
    UIDs.push(Users1[i].UserID)
}
var RegOk =false;
app.get('/login',function(req,res){
    res.render('login.ejs',{
        Users2 : Users1,
        RegOk2:RegOk
    })
})

app.get('/',function(req,res){
    sess=req.session
    res.redirect('/home')
})

app.get('/drama',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
   else  res.render('drama.ejs')
})
app.get('/horror',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    else res.render('horror.ejs')
})
app.get('/action',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    else res.render('action.ejs')
})
app.get('/register',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
   
   else
   { res.render('registration.ejs',{
        Users2 :Users1,
        Unique2:Unique1,
        Empty:empty
    })}
})
app.get('/home',function(req,res){
   
   
    sess=req.session
    res.render('home.ejs')
    console.log(req.session.username)


})

app.get('/watchlist',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    
    else{

    
    var i=getIndex(req.session.username)
    var Users=Get_Array()
    var movies =[Users[i].godfather,Users[i].godfather2,Users[i].scream,
    Users[i].conjuring,Users[i].darkknight,Users[i].fightclub]
    res.render('watchlist.ejs',{
        movies:movies
 })
}

  
})

app.post('/watchlist',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    
   else{
        
    var Users=Get_Array()
    var i =getIndex(req.session.username)
    var Del=req.body.Delete
  
    //darkknight":"1","fightclub":"0","godfather":"1","godfather2":"0","scream":"0","conjuring
    if(i!==-1){
        console.log(Users[i].UserID)
          switch(Del){
  
  
              case "0":Users[i].godfather="0";break;
              case "1":Users[i].godfather2="0";break;
              case "2":Users[i].scream="0";break;
              case "3":Users[i].conjuring="0";break;
              case "4":Users[i].darkknight="0";break;
              case "5":Users[i].fightclub="0";
          }
  
  
    }
    
   
    fs.writeFileSync("Users.json",JSON.stringify(Users))
    res.redirect('/watchlist')
   }

   })


app.get('/search',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
   else 
    res.render('searchresults.ejs')
})

app.get('/godfather',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    else
    res.render('godfather.ejs',{insideWatchlist:false})



})

app.get('/fightclub',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    res.render('fightclub.ejs',{insideWatchlist:false})
})
app.get('/darkknight',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    res.render('darkknight.ejs',{insideWatchlist:false})
})
app.get('/scream',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    res.render('scream.ejs',{insideWatchlist:false})
})

   
app.get('/godfather2',function(req,res){
 if(typeof req.session.username==='undefined')
    res.redirect('/login')
    res.render('godfather2.ejs',{
        insideWatchlist:false
    })
    
})
app.get('/conjuring',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    res.render('conjuring.ejs',{
        insideWatchlist:false
    })
})
app.post('/search',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    
    var se = req.body.Search
    console.log (se)
    se =se
    
    var nameResults = Get_Search_Results(se)
     nameResults = nameResults.reverse()
    var linkResults = get_links(nameResults)
    var imageResults = get_images(nameResults)
    
    res.render("searchresults.ejs",{nlist:nameResults,llist:linkResults,ilist:imageResults})
    console.log (nameResults)
    })
    function get_images(movies)
    {
        var result =[]
        var ref =''
          
        for( var i=0;i<movies.length;i++){
    
            switch(movies[i]) {
                case 'The Godfather (1972)': ref='/godfather';
               break;
               case 'The Godfather: Part II (1974)':ref='/godfather2';
               break;
               case 'Scream (1996)':ref='/scream';
               break;
               case 'The Conjuring (2013)':ref='/conjuring';
               break;
               case 'The Dark Knight (2008)': ref='/darkknight';
               break;
               case 'Fight Club (1999)': ref='/fightclub';
               break;
    
    
            };
    result.push(ref)
    }
     return result  
    }
    
    function get_links(movies)
    {
        var result =[]
        var picname=""
          
        for( var i=0;i<movies.length;i++){
    
            switch(movies[i]) {
                case 'The Godfather (1972)': picname="/godfather.jpg";
               break;
               case 'The Godfather: Part II (1974)':picname="/godfather2.jpg";
               break;
               case 'Scream (1996)':picname="/scream.jpg";
               break;
               case 'The Conjuring (2013)':"/conjuring.jpg";
               break;
               case 'The Dark Knight (2008)':picname="/darkknight.jpg";
               break;
               case 'Fight Club (1999)': picname="/fightclub.jpg";
               break;
    
              
    
            };
    result.push(picname)
    }
     return result  
    }
     function  Get_Search_Results  (searchitem)
    {
      
        var MovieList= ["The Godfather (1972)","The Godfather: Part II (1974)","Scream (1996)","The Conjuring (2013)","The Dark Knight (2008)","Fight Club (1999)"]
    
        var searchresultslist =[]
        
        var element =""
            while (MovieList.length>0)
            {
                 elment = MovieList.pop()
                 element = elment.toLowerCase()
    
                    for(var k =0;k<=(element.length-searchitem.length);k++)
                    {   
                    if(searchitem.toString().toLowerCase()==element.substring(k,k+searchitem.length))
                    {
                    searchresultslist.push(elment)    ;
                    break;
                    }
                    }
                   
               }
                
            return searchresultslist
    }
app.get('/regsuc',function(req,res){
    
    res.render('login.ejs',{RegOk2:true})})
app.post('/register', function(req,res){
   Unique=CheckUnique(req.body.username)
   sess=req.session
  empty=false;
  sess.username=req.body.username
  sess.password=req.body.password
  
    if( typeof  sess.username==='undefined' ||  sess.username === '' ||sess.password==='' ||typeof sess.password==='undefined'){
          res.render('registration.ejs',{Empty:true})
    } 
    else if(!Unique && typeof sess.password !== 'undefined') {
        
        res.render('registration.ejs',{Unique2: false})
    }
   else if (Unique && typeof sess.password !=='undefined') {
        Update_File({"UserID":sess.username,"PW":sess.password,"darkknight":"0","fightclub":"0","godfather":"0","godfather2":"0","scream":"0","conjuring":"0"})
        
        res.redirect('/regsuc')    }

})

app.post('/login',function(req,res){
    var Users=Get_Array()
    sess=req.session
    sess.username=req.body.username
    sess.password=req.body.password
    if(typeof sess.username!=='undefined'&& typeof sess.password!=='undefined'){
        if(CheckExists(sess.username,sess.password)===-1){//han-render b message 
       res.render('login.ejs',{Wrong:true})
        }
        else{
        sess.Watchlist=Users[CheckExists(sess.username,sess.password)].Watchlist
         res.redirect('/home')   
        }
   
    }
    
    
 })

 app.post('/godfather',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    var x =(Update_Watchlist(req.session.username,req.session.password,'godfather',req.body.Watchlist))
    if(x===-1){
        res.render('godfather.ejs',{insideWatchlist:true})
    }
    else 
    res.redirect('/watchlist')
 })
 app.post('/godfather2',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
   
    var x=(Update_Watchlist(req.session.username,req.session.password,'godfather2',req.body.Watchlist))
    if(x===-1){
        res.render('godfather2.ejs',{insideWatchlist:true})
    }
    else 
    res.redirect('/watchlist')
})

app.post('/fightclub',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    var x=(Update_Watchlist(req.session.username,req.session.password,'fightclub',req.body.Watchlist))
    if(x===-1){
        res.render('fightclub.ejs',{insideWatchlist:true})
    }
    else 
    res.redirect('/watchlist')
})

app.post('/conjuring',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
   
   var x=(Update_Watchlist(req.session.username,req.session.password,'conjuring',req.body.Watchlist))
   if(x===-1){
    res.render('conjuring.ejs',{insideWatchlist:true})
}
else 
res.redirect('/watchlist')
})

app.post('/scream',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
   
    var x=(Update_Watchlist(req.session.username,req.session.password,'scream',req.body.Watchlist))
    if(x===-1){
        res.render('scream.ejs',{insideWatchlist:true})
    }
    else 
    res.redirect('/watchlist')
})
app.post('/darkknight',function(req,res){
    if(typeof req.session.username==='undefined')
    res.redirect('/login')
    var x=Update_Watchlist(req.session.username,req.session.password,'darkknight',req.body.Watchlist)
   if(x===-1){
       res.render('darkknight.ejs',{insideWatchlist:true})
   }

   else 
   res.redirect('/watchlist')

})








 let Update_Watchlist=function(UID,Pass,name,value){
    var Users1=Get_Array()
    var ret=-1
    for(var i =0;i<Users1.length;i++){
        if(Users1[i].UserID===UID&&Users1[i].PW===Pass){
           
            if(name==='conjuring')
            {   console.log('ana wslt')
                
                if(Users1[i].conjuring===""+value && value==="1")
                ret= -1;

            else    {
                Users1[i].conjuring=""+value;
                ret=1;
                    }   
            
            }
          
          else if(name==='darkknight')
          {   
              
              if(Users1[i].darkknight===""+value && value==="1")
              ret= -1;

          else    {
              Users1[i].darkknight=""+value;
              ret=1;
                  }   
          
          }
           
          else if(name==='fightclub')
          {   
              
              if(Users1[i].fightclub===""+value && value==="1")
              ret= -1;

          else    {
              Users1[i].fightclub=""+value;
              ret=1;
                  }   
          
          }
           
          else  if(name==='godfather')
          {   
              
              if(Users1[i].godfather===""+value && value==="1")
              ret= -1;

          else    {
              Users1[i].godfather=""+value;
              ret=1;
                  }   
          
          }
         
           else if(name==='godfather2')
           {   
              
            if(Users1[i].godfather2===""+value && value==="1")
            {
            ret= -1;
            
            }
        else    {
            Users1[i].godfather2=value;
            ret=1;
                }   
        
        }
          else  if(name==='scream')
          {   
              
            if(Users1[i].scream===""+value && value==="1")
            ret= -1;

        else    {
            Users1[i].scream=""+value;
            ret=1;
                }   
        
        }

        }
       
    }

        fs.writeFileSync("Users.json",JSON.stringify(Users1)) 
    return ret   }




 app.post('/regsuc',function(req,res){
    var Users=Get_Array()
    sess=req.session
    sess.username=req.body.username
    sess.password=req.body.password
  
    if(typeof sess.username!=='undefined'&& typeof sess.password!=='undefined'){
        if(CheckExists(sess.username,sess.password)===-1){//han-render b message 
       res.render('login.ejs',{Wrong:true})
        }
        else{   
            sess.Watchlist=Users[CheckExists(sess.username,sess.password)].watchlist
  
         res.redirect('/home')   
        }
   
    }
 })


