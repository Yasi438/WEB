document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('stock-search-form');
    const stockDetails = document.getElementById('stock-details');
    const symbolDisplay = document.getElementById('stock-symbol-display');
    const priceDisplay = document.getElementById('stock-price');
    const changeDisplay = document.getElementById('stock-change');
    const buyBtn = document.getElementById('buy-btn');
    const sellBtn = document.getElementById('sell-btn');
    const quantityInput = document.getElementById('quantity');
    const chartCanvas = document.getElementById('stock-chart');
    const watchlistBtn = document.getElementById('watchlist-btn');

    let stockChart;
  
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const symbolInput = document.getElementById('stock-symbol');
      const symbol = symbolInput.value.trim().toUpperCase();
  
      if (symbol) {
        try {
          const response = await fetch(`http://localhost:3000/api/market/stock/${symbol}`);
          const data = await response.json();
  
          if (response.ok) {
            symbolDisplay.textContent = symbol;
            priceDisplay.textContent = `$${data.price}`;
            changeDisplay.textContent = `${data.change}%`;
            changeDisplay.className = data.change >= 0 ? 'text-green-500' : 'text-red-500';
            stockDetails.classList.remove('hidden');
  
            // Draw Chart
            await drawChart(symbol);
          } else {
            alert(data.message || 'Stock not found');
          }
        } catch (error) {
          console.error('Error fetching stock:', error);
          alert('Something went wrong');
        }
      }
    });
  
    buyBtn.addEventListener('click', () => handleTrade('buy'));
    sellBtn.addEventListener('click', () => handleTrade('sell'));
    watchlistBtn.addEventListener('click', () => handleWatchlist());

  
    async function handleTrade(action) {
      const symbol = symbolDisplay.textContent;
      const quantity = quantityInput.value;
  
      if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
      }
  
      try {
        const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/market/trade', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ Add this line
  },
  body: JSON.stringify({ symbol, action, quantity })
});

  
        const data = await response.json();
        if (response.ok) {
          alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
        } else {
          alert(data.message || 'Trade failed');
        }
      } catch (error) {
        console.error('Error during trade:', error);
        alert('Something went wrong');
      }
    }
  
    async function drawChart(symbol) {
      try {
        const response = await fetch(`http://localhost:3000/api/market/stock/${symbol}/history`);
        const historyData = await response.json();
  
        const labels = historyData.map(point => point.date);
        const prices = historyData.map(point => point.close);

  
        if (stockChart) {
          stockChart.destroy();
        }
  
        stockChart = new Chart(chartCanvas, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: `${symbol} Price`,
              data: prices,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: { display: true },
              y: { display: true }
            }
          }
        });
      } catch (err) {
        console.error('Chart fetch error:', err);
      }
    }
    async function handleWatchlist() {
      const symbol = symbolDisplay.textContent;
      const price = priceDisplay.textContent.replace('$', '');
      const change = changeDisplay.textContent;
    
      try {
        const response = await fetch('http://localhost:3000/api/market/watchlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ symbol, price, change })
        });
    
        const data = await response.json();
        if (response.ok) {
          alert(`${symbol} added to watchlist!`);
        } else {
          alert(data.message || 'Failed to add to watchlist');
        }
        console.log("Token:", localStorage.getItem('token'));
  
      } catch (error) {
        console.error('Watchlist error:', error);
        alert('Something went wrong');
      }
    }
  });
  
  
  