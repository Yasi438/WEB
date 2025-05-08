const express=require('express');
const {registerUser, loginUser,getProfile}=require('../controllers/userController');
const verifyToken=require('../middleware/middle');
const {chatWithAI}=require('../controllers/chatControllers')
const{getStockInfo, getTrades, postTrade, getStockHistory,addToWatchlist, getWatchlist,getStockHistoryForchat}=require('../controllers/marketControllers')


const router=express.Router();
// Creating User Router
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getProfile);
router.post('/chat', chatWithAI);
router.get('/stock/:symbol', getStockInfo);
router.get('/trade',verifyToken,getTrades);
router.post('/trade',verifyToken, postTrade);
router.get('/stock/:symbol/history', getStockHistory);
router.get('/stock/:symbol/historychat', getStockHistoryForchat);
router.post('/watchlist/add', verifyToken, addToWatchlist);
router.get('/watchlist', verifyToken, getWatchlist);


module.exports=router;