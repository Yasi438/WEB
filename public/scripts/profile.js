document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usernameEl = document.getElementById('username');
    const emailEl = document.getElementById('email');
    const errorEl = document.getElementById('errorMsg');
    const logoutBtn = document.getElementById('logoutBtn');
    

    // 🛡️ Protect route
    if (!token) {
        errorEl.textContent = 'Unauthorized. Please log in.';
        return;
    }

    try {
        const res = await fetch('/api/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
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

    // 🚪 Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/index';
    });

    // Add below your logout logic
async function loadWatchlist() {
    const watchlistBody = document.getElementById('watchlist-body');
  
    try {
      const res = await fetch('/api/market/watchlist', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!res.ok) throw new Error('Failed to fetch watchlist');
  
      const data = await res.json();
      watchlistBody.innerHTML = ''; // clear previous rows
  
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
  
  // Call it
  loadWatchlist();
  
  // load trades list
  async function loadTradesList() {
    const tradeslistBody = document.getElementById('trades-list-body');
  
    try {
      const res = await fetch('/api/market/trade', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!res.ok) throw new Error('Failed to fetch trades list');
  
      const data = await res.json();
      tradeslistBody.innerHTML = ''; // clear previous rows
  
      data.slice(0, 4).forEach(trade => {
        const {trade_date, symbol, action, price, quantity} = trade;
        const row = createTradeRow(trade_date, symbol, action, price, quantity)
  
        tradeslistBody.appendChild(row);
      });
  
    } catch (err) {
      console.error('trades list load error:', err);
    }
  }

  loadTradesList();

    // 💬 AI Chat Logic
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user's message
        const userMsg = document.createElement('p');
        userMsg.className = 'text-gray-800 font-semibold';
        userMsg.textContent = `You: ${message}`;
        chatBox.appendChild(userMsg);
        chatInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Send message to backend AI route
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            const aiMsg = document.createElement('p');
            aiMsg.className = 'text-gray-600';
            aiMsg.textContent = `AI: ${data.reply}`;
            chatBox.appendChild(aiMsg);
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (err) {
            console.error('AI Error:', err);
            const errMsg = document.createElement('p');
            errMsg.className = 'text-red-500';
            errMsg.textContent = 'AI: Something went wrong.';
            chatBox.appendChild(errMsg);
        }
    });
});


const createTradeRow = (tradeDate, symbol, action, price, quantity)=>{
  const tableRow = document.createElement("tr");
  const date = new Date(tradeDate);
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const formattedDate = `${month}/${day}/${year}`
  tableRow.innerHTML = `
    <td class="py-2 text-gray-600">${formattedDate}</td>
    <td class="py-2 text-gray-600">${symbol}</td>
    <td class="py-2 text-${action==="buy"?"green":"red"}-500">${action}</td>
    <td class="py-2 text-gray-600">$${price}</td>
    <td class="py-2 text-gray-600">${quantity}</td>
  `
  return tableRow;
};
