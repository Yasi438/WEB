document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const messageDiv = document.createElement('div');
    messageDiv.className = 'mt-4 text-center text-sm';
    form.parentNode.appendChild(messageDiv);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        const formData = { email, password };

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Save token
                localStorage.setItem('token', data.token);

                messageDiv.style.color = 'green';
                messageDiv.innerHTML = `Login successful. Redirectiong to Profile page`;
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 1000);
            } else {
                messageDiv.style.color = 'red';
                messageDiv.textContent = data.message || 'Invalid credentials.';
            }
        } catch (error) {
            console.error('Login error:', error);
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'Something went wrong. Please try again.';
        }
    });
});
