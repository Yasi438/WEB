const express=require('express');
const registerUser=require('../controllers/userController');


const router=express.Router();
// Creating User Router
router.post('/register', registerUser);






module.exports=router;