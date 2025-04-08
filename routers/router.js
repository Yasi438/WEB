const express=require('express');
const {registerUser, loginUser,getProfile}=require('../controllers/userController');
const verifyToken=require('../middleware/middle');
const {chatWithAI}=require('../controllers/chatControllers')
const{getStockInfo, postTrade, getStockHistory,addToWatchlist, getWatchlist}=require('../controllers/marketControllers')


const router=express.Router();
// Creating User Router
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getProfile);
router.post('/chat', chatWithAI);
router.get('/stock/:symbol', getStockInfo);
router.post('/trade', postTrade);
router.get('/stock/:symbol/history', getStockHistory);
router.post('/watchlist/add', verifyToken, addToWatchlist);
router.get('/watchlist', verifyToken, getWatchlist);


module.exports=router;