document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const usernameEl = document.getElementById('username');
  const emailEl = document.getElementById('email');
  const errorEl = document.getElementById('errorMsg');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!token) {
    errorEl.textContent = 'Unauthorized. Please log in.';
    return;
  }

  try {
    const res = await fetch('/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Token invalid or expired');

    const user = await res.json();
    usernameEl.textContent = user.username;
    emailEl.textContent = user.email;
  } catch (err) {
    console.error('Profile load failed:', err);
    errorEl.textContent = 'Session expired. Redirecting to login...';
    setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }, 1500);
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index';
  });

  async function loadWatchlist() {
    const watchlistBody = document.getElementById('watchlist-body');

    try {
      const res = await fetch('/api/market/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch watchlist');

      const data = await res.json();
      watchlistBody.innerHTML = '';

      data.slice(0, 4).forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="py-2 text-gray-600">${stock.symbol}</td>
          <td class="py-2 text-gray-600">$${parseFloat(stock.price).toFixed(2)}</td>
          <td class="py-2 ${stock.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}">${stock.change}</td>
        `;
        watchlistBody.appendChild(row);
      });

    } catch (err) {
      console.error('Watchlist load error:', err);
    }
  }

  loadWatchlist();

  async function loadTradesList() {
    const tradeslistBody = document.getElementById('trades-list-body');

    try {
      const res = await fetch('/api/market/trade', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch trades list');

      const data = await res.json();
      tradeslistBody.innerHTML = '';

      data.slice(0, 4).forEach(trade => {
        const { trade_date, symbol, action, price, quantity } = trade;
        const row = createTradeRow(trade_date, symbol, action, price, quantity);
        tradeslistBody.appendChild(row);
      });

    } catch (err) {
      console.error('Trades list load error:', err);
    }
  }

  loadTradesList();

  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatBox = document.getElementById('chat-box');

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = chatInput.value.trim();
    chatInput.value = '';

    if (!input) return;

    if (input.toLowerCase().startsWith('symbol:')) {
      const symbol = input.split(':')[1].trim().toUpperCase();
      const intentionVal = document.getElementById('intention-select').value;
      const riskVal = document.getElementById('risk-select').value;

      const intentionSentence = {
        "short-term": "I'm considering Interday trading based on recent price volatility.",
        "scalping": "I'm considering 1 hour Scalping trading based on recent price volatility.",
        "swing": "I'm considering swing trading using recent technical patterns."
      }[intentionVal] || "";

      try {
        const res = await fetch(`/api/market/stock/${symbol}/historychat`);
        if (!res.ok) throw new Error('Failed to fetch price history');

        const data = await res.json();
        const priceRange = data.map(point => point.close).filter(p => p != null);


        const message = `symbol: ${symbol}
        price_range: [${priceRange.join(', ')}]
        intention: ${intentionSentence}
        risk_tolerance: ${riskVal}
        strategy: Combine RSI 5 and SMA 10 to identify the trend direction,
        calulate on those price points provide and 
        Give me your final judgment to buy, sell, or take no action.
        Summarize in one paragraph.`;

        await sendToAI(message);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        appendToChat(`AI: Error fetching data for ${symbol}`);
      }

      return;
    }

    await sendToAI(input);
  });

  async function sendToAI(message) {
    appendToChat(`You: ${message}`);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      appendToChat(`AI: ${data.reply}`);
    } catch (err) {
      console.error('AI Error:', err);
      appendToChat('AI: Something went wrong.');
    }
  }

  function appendToChat(text) {
    const isUser = text.startsWith('You:');
    const cleanText = text.replace('You: ', '').replace('AI: ', '');

    const bubble = document.createElement('div');
    bubble.className = `p-2 rounded text-sm max-w-full ${
      isUser
        ? 'bg-blue-100 text-blue-800 self-end text-right ml-auto'
        : 'bg-gray-100 text-gray-700 w-max'
    }`;
    bubble.textContent = cleanText;

    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

const createTradeRow = (tradeDate, symbol, action, price, quantity) => {
  const tableRow = document.createElement("tr");
  const date = new Date(tradeDate);
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${month}/${day}/${year}`;
  tableRow.innerHTML = `
    <td class="py-2 text-gray-600">${formattedDate}</td>
    <td class="py-2 text-gray-600">${symbol}</td>
    <td class="py-2 text-${action === "buy" ? "green" : "red"}-500">${action}</td>
    <td class="py-2 text-gray-600">$${price}</td>
    <td class="py-2 text-gray-600">${quantity}</td>
  `;
  return tableRow;
};
