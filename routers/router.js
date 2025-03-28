const express=require('express');
const {registerUser, loginUser,getProfile}=require('../controllers/userController');
const verifyToken=require('../middleware/middle');


const router=express.Router();
// Creating User Router
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getProfile);






module.exports=router;