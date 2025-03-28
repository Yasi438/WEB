const express=require('express');
const path=require('path');
const Routing=require('./routers/router')

const app=express();
// path 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', Routing);




// home page;
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/pages/index.html'))
})
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/pages/register.html'))
})
// login page;
app.get('/login', (req,res)=>{
  
    res.sendFile(path.join(__dirname, 'public/pages/login.html'));
})
// user profile page;
app.get('/profile', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/pages/profile.html'));
})


const PORT=3000;
app.listen(PORT, ()=>{
    console.log(`server is running in : localhost${PORT}`);
})