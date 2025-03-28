document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usernameEl = document.getElementById('username');
    const emailEl = document.getElementById('email');
    const errorEl = document.getElementById('errorMsg');

    // Protect route
    if (!token) {
        errorEl.textContent = 'Unauthorized. Please log in.';
        return;
    }

    try {
        const res = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error('Invalid token or session expired');
        }

        const user = await res.json();
        usernameEl.textContent = user.username;
        emailEl.textContent = user.email;
    } catch (err) {
        console.error('Profile fetch failed:', err);
        errorEl.textContent = 'Session expired. Please log in again.';
        setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }, 1500);
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    });

    // Chat
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            const userMsg = document.createElement('p');
            userMsg.className = 'text-gray-800 font-semibold';
            userMsg.textContent = `You: ${message}`;
            chatBox.appendChild(userMsg);

            setTimeout(() => {
                const aiMsg = document.createElement('p');
                aiMsg.className = 'text-gray-600';
                aiMsg.textContent = `AI: Thanks for your message! I'm here to help with trading advice.`;
                chatBox.appendChild(aiMsg);
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 1000);

            chatInput.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });
});
