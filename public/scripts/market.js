document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('stock-search-form');
    const stockDetails = document.getElementById('stock-details');
    const symbolDisplay = document.getElementById('stock-symbol-display');
    const priceDisplay = document.getElementById('stock-price');
    const changeDisplay = document.getElementById('stock-change');
    const buyBtn = document.getElementById('buy-btn');
    const sellBtn = document.getElementById('sell-btn');
    const quantityInput = document.getElementById('quantity');

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

    async function handleTrade(action) {
        const symbol = symbolDisplay.textContent;
        const quantity = quantityInput.value;
        if (!quantity || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/market/trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
});
