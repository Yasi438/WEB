document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const messageDiv = document.getElementById('message');
    const profileDiv = document.getElementById('profileData');

    if (!token) {
        messageDiv.textContent = 'You must be logged in to view this page.';
        return;
    }

    try {
        const res = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            messageDiv.textContent = 'Unauthorized. Please log in again.';
            return;
        }

        const data = await res.json();
        profileDiv.innerHTML = `
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Email:</strong> ${data.email}</p>
        `;
    } catch (err) {
        console.error('Error fetching profile:', err);
        messageDiv.textContent = 'Error loading profile.';
    }
});
