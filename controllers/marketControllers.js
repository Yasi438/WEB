const yahooFinance = require('yahoo-finance2').default;
const db = require('../confiq/db'); // make sure your db config is here

// GET /market/stock/:symbol
const getStockInfo = async (req, res) => {
  const { symbol } = req.params;

  try {
    const quote = await yahooFinance.quote(symbol);
    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json({
      price: quote.regularMarketPrice.toFixed(2),
      change: ((quote.regularMarketChangePercent || 0) * 100).toFixed(2)
    });
  } catch (error) {
    console.error('Yahoo Finance error:', error);
    res.status(500).json({ message: 'Error fetching stock data' });
  }
};

// POST /market/trade
const postTrade = async (req, res) => {
  const { symbol, action, quantity } = req.body;
  const userId = 1; // TODO: Replace with user ID from session/token

  try {
    const quote = await yahooFinance.quote(symbol);
    const price = quote.regularMarketPrice;

    await db.query(
      'INSERT INTO trades (user_id, symbol, action, price, quantity) VALUES (?, ?, ?, ?, ?)',
      [userId, symbol, action, price, quantity]
    );

    res.json({ message: 'Trade recorded' });
  } catch (error) {
    console.error('Trade error:', error);
    res.status(500).json({ message: 'Error processing trade' });
  }
};

// GET /market/stock/:symbol/history
const getStockHistory = async (req, res) => {
  const { symbol } = req.params;

  try {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(today.getDate() - 30);

    const history = await yahooFinance.historical(symbol, {
      period1: oneMonthAgo,
      period2: today,
      interval: '1d'
    });

    if (!history.length) {
      return res.status(404).json({ message: 'No data found for this symbol.' });
    }

    const chartData = history.map((point) => ({
      date: point.date.toISOString().split('T')[0],
      close: point.close, 
    }));

    res.json(chartData);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Error fetching historical data.' });
  }
};




module.exports = {
  getStockInfo,
  postTrade,
  getStockHistory
};
