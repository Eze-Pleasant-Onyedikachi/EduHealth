document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Check if passwords match
    if (data.password !== data['confirm-password']) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password,
            }),
        });

        // Parse the response JSON
        const responseData = await response.json();

        if (response.ok) {
            alert('Registration successful! Redirecting to login page...');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert(responseData.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});