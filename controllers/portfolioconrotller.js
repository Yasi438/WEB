const db = require('../confiq/db');
const yahooFinance = require('yahoo-finance2').default;

const getPortfolio = async (req, res) => {
  const userId = req.user.id;

  try {
    const [trades] = await db.query('SELECT * FROM trades WHERE user_id = ?', [userId]);

    const holdingsMap = {};

    for (const trade of trades) {
      const { id, symbol, action, price, quantity } = trade;

      if (!holdingsMap[symbol]) {
        holdingsMap[symbol] = {
          id,
          symbol,
          totalQuantity: 0,
          totalCost: 0,
          currentPrice: 0,
          pnl: 0,
        };
      }

      if (action === 'buy') {
        holdingsMap[symbol].totalQuantity += quantity;
        holdingsMap[symbol].totalCost += quantity * price;
      } else if (action === 'sell') {
        holdingsMap[symbol].totalQuantity -= quantity;
        holdingsMap[symbol].totalCost -= quantity * price;
      }
    }

    const result = [];

    for (const symbol in holdingsMap) {
      const holding = holdingsMap[symbol];
      if (holding.totalQuantity <= 0) continue; // skip closed positions

      const quote = await yahooFinance.quote(symbol);
      const currentPrice = quote.regularMarketPrice || 0;
      const avgBuyPrice = holding.totalCost / holding.totalQuantity;

      const pnl = (currentPrice - avgBuyPrice) * holding.totalQuantity;

      result.push({
        id: holding.id,
        symbol: holding.symbol,
        quantity: holding.totalQuantity,
        bought_price: avgBuyPrice.toFixed(2),
        current_price: currentPrice.toFixed(2),
        pnl: pnl.toFixed(2),
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ message: 'Error loading portfolio' });
  }
};

module.exports = { getPortfolio };
