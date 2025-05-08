document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('portfolio-body');
    const token = localStorage.getItem('token');
  
    try {
      const res = await fetch('/api/portfolio', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (!res.ok) throw new Error('Failed to load portfolio');
  
      const data = await res.json();
      tableBody.innerHTML = '';
  
      data.forEach(item => {
        const row = document.createElement('tr');
        const isProfit = parseFloat(item.pnl) >= 0;
  
        row.innerHTML = `
          <td class="py-2 px-4 text-gray-700">${item.id}</td>
          <td class="py-2 px-4 text-gray-700">${item.symbol}</td>
          <td class="py-2 px-4 text-gray-700">${item.quantity}</td>
          <td class="py-2 px-4 text-gray-700">$${item.bought_price}</td>
          <td class="py-2 px-4 text-gray-700">$${item.current_price}</td>
          <td class="py-2 px-4 font-semibold ${isProfit ? 'text-green-600' : 'text-red-500'}">$${item.pnl}</td>
        `;
        tableBody.appendChild(row);
      });
  
    } catch (err) {
      console.error('Portfolio load error:', err);
      tableBody.innerHTML = '<tr><td colspan="6" class="text-red-500 p-4 text-center">Failed to load portfolio</td></tr>';
    }
  });
  